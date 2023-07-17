import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GcmAreaComponent } from './area.component';
import { NgChartsModule } from 'ng2-charts';

const components = [GcmAreaComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, NgChartsModule],
  exports: components,
})
export class GcmAreaModule {}