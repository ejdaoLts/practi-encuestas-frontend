import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'gcm-stacked-bar',
  templateUrl: './stacked-bar.component.html',
  styleUrls: ['./stacked-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GcmStackedBarComponent implements OnInit {
  @Input() description: string = '';

  @Input() data!: any;

  @Input() class: string = '';

  @Input() style: string = '';

  datasets: any;

  labels: any;

  barChartOptions: {} = {
    responsive: true,
  };
  barChartLegend = false;

  public ngOnInit(): void {
    this.datasets = this.data.datasets;
    this.labels = this.data.labels;
  }
}
