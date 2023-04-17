import { Pipe, PipeTransform } from '@angular/core';
import { FormatTimes, TimerService } from '@shared/services';

@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
  constructor(private _timeUtilities: TimerService) {}

  public transform(item: any, format: FormatTimes = 1, upperCase = true) {
    if ([undefined, null].indexOf(item) < 0) {
      return this._timeUtilities.formatDate(item, format, upperCase);
    } else {
      return 'NULL';
    }
  }
}
