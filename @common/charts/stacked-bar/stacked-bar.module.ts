import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GcmStackedBarComponent } from './stacked-bar.component';
import { NgChartsModule } from 'ng2-charts';

const components = [GcmStackedBarComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, NgChartsModule],
  exports: components,
})
export class GcmStackedBarModule {}
