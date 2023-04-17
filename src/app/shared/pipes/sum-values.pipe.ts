import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sumValues' })
export class SumValuesPipe implements PipeTransform {
  public transform(data: any[], item: string, formatted = true): number | string {
    try {
      const result = data.map((t: any) => t[item]).reduce((acc: any, value: any) => acc + value, 0);
      return formatted ? Intl.NumberFormat('en-US').format(Math.ceil(result)) : result;
    } catch (error) {
      return 'isNaN';
    }
  }
}
