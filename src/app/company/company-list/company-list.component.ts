import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent, Observable, Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { ICompany } from '../interfaces/company';
import { CompanyService } from '../services/company.service';
import { ConfirmDialogComponent } from 'src/app/_shared/components';
import { NotificationService } from 'src/app/_shared/services';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent implements OnInit, AfterViewInit, OnDestroy {
  public companiesDataSource!: MatTableDataSource<ICompany>;
  public displayedColumns: string[] = [
    'companyName',
    'email',
    'phoneNumber',
    'createdAt',
    'action',
  ];
  private _destroy$ = new Subject();
  private _deleteDialogRef!: MatDialogRef<ConfirmDialogComponent>;
  public isLoading$!: Observable<boolean>;
  get noDocumentFound() {
    return this.companiesDataSource?.filteredData.length < 1;
  }
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filterInput', { static: true }) input!: ElementRef;

  constructor(
    private _companyService: CompanyService,
    private _dialog: MatDialog,
    private _notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._companyService.isLoading$;
    this._companyService
      .getCompanies()
      .pipe(
        tap((companies) => {
          this.companiesDataSource = new MatTableDataSource(companies);
          this.companiesDataSource.sort = this.sort;
          this.companiesDataSource.paginator = this.paginator;
        }),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  ngAfterViewInit() {
    const inputElement = this.input.nativeElement;

    fromEvent(inputElement, 'keyup')
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.companiesDataSource.filter = inputElement.value
            .trim()
            .toLowerCase();
        }),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  delete(companyId: string) {
    this._deleteDialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '333px',
      panelClass: 'dialogPanel',
      data: { message: 'Delete this company ?' },
    });

    this._deleteDialogRef
      .beforeClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => this._companyService.deleteCompany(companyId)),
        takeUntil(this._destroy$),
      )
      .subscribe(({ status, message }) => {
        if (status === 200) {
          this._notification.success(message);
        }
      });
  }
}
