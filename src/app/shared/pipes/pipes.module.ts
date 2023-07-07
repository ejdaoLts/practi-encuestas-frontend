import { NgModule } from '@angular/core';
import { FormatDatePipe } from './format-date.pipe';
import { SumValuesPipe } from './sum-values.pipe';
import { FormatMoneyPipe } from './format-money.pipe';
import { TimeFromNowPipe } from './time-from-now.pipe';
import { GcmFormatDecimalPipe } from './format-decimal.pipe';

const pipes = [
  FormatDatePipe,
  GcmFormatDecimalPipe,
  SumValuesPipe,
  FormatMoneyPipe,
  TimeFromNowPipe,
];

@NgModule({
  declarations: pipes,
  exports: pipes,
})
export class PipesModule {}
