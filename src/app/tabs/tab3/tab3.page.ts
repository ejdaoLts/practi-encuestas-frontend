import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { GetEvaluacionesPendientesHandler } from './handlers';
import { MatTableDataSource } from '@angular/material/table';
import { EvaluacionPendienteDto } from './dtos';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@shared/pipes';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, PipesModule],
  providers: [GetEvaluacionesPendientesHandler],
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab3Page implements OnInit {
  public dataSource = new MatTableDataSource<EvaluacionPendienteDto>([]);

  private _loading!: HTMLIonLoadingElement;

  constructor(
    private _getEvaluacionesPendientes: GetEvaluacionesPendientesHandler,
    private loadingCtrl: LoadingController,
    private _cd: ChangeDetectorRef
  ) {}

  public async ngOnInit(): Promise<void> {
    await this._showLoading();

    const result = await this._getEvaluacionesPendientes.execute();

    result.fold({
      right: _ => {
        this._instanceDataSource(_);
        this._loading.remove();
      },
    });
  }

  private _instanceDataSource(data: EvaluacionPendienteDto[]): void {
    this.dataSource = new MatTableDataSource<EvaluacionPendienteDto>(data);
    this._cd.markForCheck();
  }

  private async _showLoading(): Promise<void> {
    this._loading = await this.loadingCtrl.create({
      message: 'Obteniendo evaluaciones pendientes...',
    });

    this._loading.present();
  }
}
