import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(isoDate: string, style: "short" | "long" = "long") {
    const timeStamp = new Date(isoDate);
    const now = new Date();
    const secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;

    const oneMinute = 60; // 60
    const oneHour = 3600; // oneMinute * 60
    const oneDay = 86400; // oneHour * 24
    const twoDays = 172800; // oneDay * 2
    const oneWeek = 604800; // oneDay * 7
    const twoWeeks = 1209600; // oneWeek * 2
    const oneMonth = 2592000; // oneDay * 30
    const twoMonths = 5184000; // oneMonth * 2
    const oneYear = 31104000; // oneMonth * 12
    const twoYears = 62208000; // oneYear * 2
    const tenYears = 311040000; // oneYear * 10

    if (secondsPast < oneMinute) {
      const postfix = style === "short" ? 'sec' : ' seconds ago';
      return this.makeString(secondsPast) + postfix;
    }
    if (secondsPast < oneHour) {
      const postfix = style === "short" ? 'min' : ' minutes ago';
      return this.makeString(secondsPast / oneMinute) + postfix;
    }
    if (secondsPast < oneDay) {
      const postfix = style === "short" ? 'hour' : ' hours ago';
      return this.makeString(secondsPast / oneHour) + postfix;
    }
    if (secondsPast <= twoDays) {
      const text = style === "short" ? '1d' : 'Yesterday';
      return text;
    }
    if (secondsPast < oneWeek) {
      const postfix = style === "short" ? 'd' : ' days ago';
      return this.makeString(secondsPast / oneDay) + postfix;
    }
    if (secondsPast < twoWeeks) {
      const text = style === "short" ? '1w' : 'A week ago';
      return text;
    }
    if (secondsPast < oneMonth) {
      const postfix = style === "short" ? 'w' : ' weeks ago';
      return this.makeString(secondsPast / oneWeek) + postfix;
    }
    if (secondsPast < twoMonths) {
      const text = style === "short" ? '1 month' : 'A month ago';
      return text;
    }
    if (secondsPast < oneYear) {
      const postfix = style === "short" ? ' months' : ' months ago';
      return this.makeString(secondsPast / oneMonth) + postfix;
    }
    if (secondsPast < twoYears) {
      const text = style === "short" ? 'y' : 'A year ago';
      return text;
    }
    if (secondsPast < tenYears) {
      const postfix = style === "short" ? ' y' : ' years ago';
      return this.makeString(secondsPast / oneMonth) + postfix;
    }
    if (secondsPast > tenYears) {
      const day = timeStamp.getDate();
      const month = (timeStamp.toDateString() as any)
        .match(/ [a-zA-Z]*/)[0]
        .replace(' ', '');
      const year =
        timeStamp.getFullYear() === now.getFullYear()
          ? ''
          : ' ' + timeStamp.getFullYear();
      return day + ' ' + month + year;
    }
    return isoDate;
  }

  private makeString(miliseconds: number): string {
    return `${Math.floor(miliseconds)}`;
  }
}
