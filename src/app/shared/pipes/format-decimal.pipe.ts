import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDecimal' })
export class GcmFormatDecimalPipe implements PipeTransform {
  transform(number: number | string | undefined): string {
    if (typeof number === 'number') {
      if (Number.isInteger(number)) {
        return number.toString();
      } else {
        return number.toFixed(2);
      }
    } else {
      return number || 'undefined';
    }
  }
}
