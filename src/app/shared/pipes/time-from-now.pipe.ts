import { Pipe, PipeTransform } from '@angular/core';
import { TimerService } from '@shared/services';

@Pipe({ name: 'timeFromNow' })
export class TimeFromNowPipe implements PipeTransform {
  constructor(private _timer: TimerService) {}

  public transform(date: CanBeDate, from: CanBeDate = new Date(), showAll = false) {
    return this._timer.timeFromNow(date, { from, showAll, upd: false, ago: true });
  }
}
