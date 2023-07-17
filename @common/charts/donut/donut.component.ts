import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Chart, ChartItem, registerables } from 'chart.js';

@Component({
  selector: 'gcm-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GcmDonutComponent implements AfterViewInit {
  @Input() description: string = '';

  @Input() labels: any = [];

  @Input() data: any = [];

  @Input() class: string = '';

  @Input() style: string = '';

  @Input() hasLegend: boolean = false;

  @Input() positionLegend: 'top' | 'right' | 'left' | 'bottom' = 'top';

  public id: string = (Math.floor(Math.random() * (999999 - 111111)) + 111111).toString();

  constructor() {
    Chart.register(...registerables);
  }

  public ngAfterViewInit(): void {
    this.data.datasets.map((r: any) => {
      r.hoverOffset = 4;
    });

    let data: any,
      options: any,
      chart: any,
      ctx: ChartItem | any = document.getElementById(this.id) as HTMLElement;

    data = this.data;
    options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: false,
        },
        legend: {
          display: this.hasLegend,
          position: this.positionLegend,
        },
      },
    };

    try {
      chart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options,
      });
    } catch (error) {}
  }
}
