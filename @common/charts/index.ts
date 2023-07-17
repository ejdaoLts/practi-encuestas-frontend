export * from './area/area.module';
export * from './donut/donut.module';
export * from './stacked-bar/stacked-bar.module';

export interface GcmChartsData {
  labels: string[] | undefined;
  datasets: GcmChartsDataSets[];
}
export interface GcmChartsDataSets {
  label?: string;
  data: any[] | any;
  stack?: string;
  lineTension?: number;
  radius?: number;
  fill?: boolean;
  backgroundColor?: string[] | string;
  hoverBackgroundColor?: string[] | string;
  borderColor?: string[] | string;
  hoverBorderColor?: string[] | string;
  pointBorderBackgroundColor?: string[] | string;
  pointBorderColor?: string[] | string;
  pointHoverBorderColor?: string[] | string;
  pointBackgroundColor?: string[] | string;
  pointHoverBackgroundColor?: string[] | string;
  hoverOffset?: number;
}
