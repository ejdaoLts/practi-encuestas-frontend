import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Chart, ChartItem, registerables } from 'chart.js';

@Component({
  selector: 'gcm-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GcmAreaComponent implements AfterViewInit {
  public id: string = (Math.floor(Math.random() * (999999 - 111111)) + 111111).toString();

  @Input() class: string = '';

  @Input() style: string = '';

  @Input() description: string = '';

  @Input() data!: any;

  constructor() {
    Chart.register(...registerables);
  }

  public ngAfterViewInit(): void {
    this.data.datasets.map((r: any, i: number) => {
      r.lineTension = 0.5;
      r.radius = 3;
      r.fill = true;
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
          position: 'top',
          text: 'Area Chartjs',
          fontSize: 12,
          fontColor: '#666',
        },
        legend: {
          display: false,
        },
      },
    };

    chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: options,
    });
  }
}
