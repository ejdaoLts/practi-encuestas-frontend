import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatMoney' })
export class FormatMoneyPipe implements PipeTransform {
  public transform(number: number, round = true): string {
    if (typeof number === 'number') {
      const numberFt = round ? Math.ceil(number) : number;
      return Intl.NumberFormat('en-US').format(numberFt);
    } else {
      return number;
    }
  }
}
