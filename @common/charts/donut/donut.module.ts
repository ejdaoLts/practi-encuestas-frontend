import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GcmDonutComponent } from './donut.component';
import { NgChartsModule } from 'ng2-charts';

const components = [GcmDonutComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, NgChartsModule],
  exports: components,
})
export class GcmDonutModule {}
