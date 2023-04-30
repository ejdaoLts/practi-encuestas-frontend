import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@shared/pipes';
import { EvaluacionPendienteDto, PuntoEvaluacionT1 } from '@http/dtos';
import {
  GetDataForGenerateEvaluacionService,
  GetEvaluacionesPendientesService,
} from '@http/services';
import { TiposEvaluacion } from '@http/constants';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, PipesModule],
  selector: 'app-evaluaciones',
  templateUrl: 'evaluaciones.page.html',
  styleUrls: ['evaluaciones.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluacionesPage implements OnInit {
  public dataSource = new MatTableDataSource<EvaluacionPendienteDto>([]);
  public evaluacionSelected?: EvaluacionPendienteDto;
  public isModalOpen = false;
  public tiposEvaluacion = TiposEvaluacion;

  private _loading!: HTMLIonLoadingElement;

  private _dataForTipoEvaluacion: any;

  private _preguntaActualT1 = 0;

  constructor(
    private _getDataForGenerateEvaluacion: GetDataForGenerateEvaluacionService,
    private _getEvaluacionesPendientes: GetEvaluacionesPendientesService,
    private loadingCtrl: LoadingController,
    private _cd: ChangeDetectorRef
  ) {}

  public async ngOnInit(): Promise<void> {
    await this._showLoading();

    const result = await this._getEvaluacionesPendientes.execute();

    result.fold({
      right: _ => {
        console.log(_);
        this._instanceDataSource(_);
        this._removeLoading();
      },
    });
  }

  public async clickOnToggleModal(
    open: boolean,
    evaluacion?: EvaluacionPendienteDto
  ): Promise<void> {
    if (evaluacion) {
      await this._showLoading('Obteniendo información para generar evaluación...');
      this.evaluacionSelected = evaluacion;
      const result = await this._getDataForGenerateEvaluacion.execute(evaluacion.tipo_id);

      result.fold({
        right: _ => {
          this._dataForTipoEvaluacion = _;
          this._removeLoading();
        },
      });
    }

    if (open) {
      this.isModalOpen = true;
    } else {
      this.isModalOpen = false;
      this._preguntaActualT1 = 0;
    }

    this._cd.markForCheck();
  }

  public clickOnNuevaPregunta(): void {
    this._preguntaActualT1++;
  }

  public clickOnAnteriorPregunta(): void {
    this._preguntaActualT1--;
  }

  private _instanceDataSource(data: EvaluacionPendienteDto[]): void {
    this.dataSource = new MatTableDataSource<EvaluacionPendienteDto>(data);
    this._cd.markForCheck();
  }

  private async _showLoading(message = 'Obteniendo evaluaciones pendientes...'): Promise<void> {
    this._loading = await this.loadingCtrl.create({
      message,
    });

    this._loading.present();
  }

  private _removeLoading(): void {
    this._loading.remove();
  }

  get pt1(): PuntoEvaluacionT1 {
    return this._dataForTipoEvaluacion[this._preguntaActualT1]!;
  }

  get evaT1(): PuntoEvaluacionT1[] {
    return this._dataForTipoEvaluacion;
  }

  get paT1(): number {
    return this._preguntaActualT1;
  }
}
