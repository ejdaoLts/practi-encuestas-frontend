import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@shared/pipes';
import { EvaluacionPendienteDto, PuntoEvaluacionT1, PuntoEvaluacionT2 } from '@http/dtos';
import {
  CalificarEvaluacionService,
  GetDataForGenerateEvaluacionService,
  GetEvaluacionesPendientesService,
} from '@http/services';
import { TiposEvaluacion } from '@http/constants';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, PipesModule],
  selector: 'app-evaluaciones',
  templateUrl: 'evaluaciones.page.html',
  styleUrls: ['evaluaciones.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluacionesPage implements OnInit, OnDestroy {
  public dataSource = new MatTableDataSource<EvaluacionPendienteDto>([]);
  public evaluacionSelected?: EvaluacionPendienteDto;
  public isModalOpen = false;
  public tiposEvaluacion = TiposEvaluacion;

  private _loading!: HTMLIonLoadingElement;

  private _dataForTipoEvaluacion: any;

  private _preguntaActual = 0;
  private _tipoEvaluacionActual = TiposEvaluacion.T1;

  public filter = new FormControl('');

  private _subs1: Subscription;

  constructor(
    private _getDataForGenerateEvaluacion: GetDataForGenerateEvaluacionService,
    private _getEvaluacionesPendientes: GetEvaluacionesPendientesService,
    private _calificarEvaluacion: CalificarEvaluacionService,
    private _alertController: AlertController,
    private _loadingCtrl: LoadingController,
    private _cd: ChangeDetectorRef
  ) {
    this._subs1 = this.filter.valueChanges.subscribe(_ => {
      this.dataSource.filter = (_ || '').trim().toLowerCase();
      console.log(this.dataSource.filteredData);
    });
  }

  public async ngOnInit(): Promise<void> {
    await this._fetchEvaluacionesPendientes();
  }

  public refresh(): void {
    this._fetchEvaluacionesPendientes();
  }

  public async clickOnToggleModal(
    open: boolean,
    evaluacion?: EvaluacionPendienteDto
  ): Promise<void> {
    if (evaluacion) {
      await this._showLoading('Obteniendo información para generar evaluación...');
      this.evaluacionSelected = evaluacion;
      this._tipoEvaluacionActual = evaluacion.tipo_evaluacion.id;
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
      this._preguntaActual = 0;
    }

    this._cd.markForCheck();
  }

  private async _fetchEvaluacionesPendientes(): Promise<void> {
    await this._showLoading();

    const result = await this._getEvaluacionesPendientes.execute();

    result.fold({
      right: _ => {
        this._instanceDataSource(_);
      },
    });

    this._removeLoading();
  }

  private _instanceDataSource(data: EvaluacionPendienteDto[]): void {
    this.dataSource = new MatTableDataSource<EvaluacionPendienteDto>(data);
    this._cd.markForCheck();
  }

  private async _showLoading(message = 'Obteniendo evaluaciones pendientes...'): Promise<void> {
    this._loading = await this._loadingCtrl.create({
      message,
    });

    this._loading.present();
  }

  private _removeLoading(): void {
    this._loading.remove();
  }

  get preguntaActual(): number {
    return this._preguntaActual;
  }

  get tipoEvaluacionActual(): TiposEvaluacion {
    return this._tipoEvaluacionActual;
  }

  /************************************************************************************************/
  /********************************** EVA T1 ******************************************************/
  /************************************************************************************************/
  public clickOnNuevaPregunta(): void {
    this._preguntaActual++;
  }

  public clickOnAnteriorPregunta(): void {
    this._preguntaActual--;
  }

  public async clickOnFinalizarT1OrT2(tipoEvaluacion: TiposEvaluacion): Promise<void> {
    this._loading = await this._loadingCtrl.create({
      message: 'Calificando evaluación, por favor espere',
    });
    this._loading.present();
    this._cd.markForCheck();

    const res = await this._calificarEvaluacion.execute(
      tipoEvaluacion,
      this.evaluacionSelected!,
      this._dataForTipoEvaluacion
    );

    this._loading.remove();
    this._cd.markForCheck();

    let message = '';

    res.fold({
      right: () => {
        message = 'Evaluación calificada exitosamente';
      },
      left: () => {
        message = 'La evaluación no ha podido ser calificada, intentelo nuevamente';
      },
    });

    const alert = await this._alertController.create({
      header: 'Estado de la evaluación',
      message,
      buttons: ['OK'],
    });

    await alert.present();

    this.clickOnToggleModal(false);

    await this._fetchEvaluacionesPendientes();
  }

  get pt1(): PuntoEvaluacionT1 {
    return this._dataForTipoEvaluacion[this._preguntaActual]!;
  }

  get evaT1(): PuntoEvaluacionT1[] {
    return this._dataForTipoEvaluacion;
  }

  get pt2(): PuntoEvaluacionT2 {
    return this._dataForTipoEvaluacion[this._preguntaActual]!;
  }

  get evaT2(): PuntoEvaluacionT2[] {
    return this._dataForTipoEvaluacion;
  }

  public ngOnDestroy(): void {
    this._subs1.unsubscribe();
  }
}
