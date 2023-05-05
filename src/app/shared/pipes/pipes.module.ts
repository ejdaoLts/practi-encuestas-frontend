import { NgModule } from '@angular/core';
import { FormatDatePipe } from './format-date.pipe';
import { SumValuesPipe } from './sum-values.pipe';
import { FormatMoneyPipe } from './format-money.pipe';
import { TimeFromNowPipe } from './time-from-now.pipe';

const pipes = [FormatDatePipe, SumValuesPipe, FormatMoneyPipe, TimeFromNowPipe];

@NgModule({
  declarations: pipes,
  exports: pipes,
})
export class PipesModule {}
