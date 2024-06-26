import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  INIT,
  MetaReducer,
  UPDATE,
} from '@ngrx/store';
import { LocalStorageService } from '../_shared/services';
import { RouterStateUrl } from '../_shared/services/router-serializer';
import { AuthState } from './auth/auth.model';
import { authReducer } from './auth/auth.reducer';
import { SettingsState } from './settings/settings.model';
import { settingsReducer } from './settings/settings.reducer';

export interface AppState {
  readonly router: RouterReducerState<RouterStateUrl>;
  readonly settings: SettingsState;
  readonly auth: AuthState;
}

type Reducer = ActionReducer<AppState>;

function initStateFromLocalStorage(reducer: Reducer): Reducer {
  return function (state, action) {
    const newState = reducer(state, action);

    if ([INIT.toString(), UPDATE.toString()].includes(action.type)) {
      return { ...newState, ...LocalStorageService.loadInitialState() };
    }

    return newState;
  };
}

export const reducer: ActionReducerMap<AppState> = {
  router: routerReducer,
  settings: settingsReducer,
  auth: authReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [
  initStateFromLocalStorage,
];

export const $_routerState = createFeatureSelector<
  AppState,
  RouterReducerState<RouterStateUrl>
>('router');

export const $_settingsState = createFeatureSelector<
	AppState,
	SettingsState
>('settings');