import { NgModule } from '@angular/core';
import { FormatDatePipe } from './format-date.pipe';
import { SumValuesPipe } from './sum-values.pipe';
import { FormatMoneyPipe } from './format-money.pipe';

const pipes = [FormatDatePipe, SumValuesPipe, FormatMoneyPipe];

@NgModule({
  declarations: pipes,
  exports: pipes,
})
export class PipesModule {}
