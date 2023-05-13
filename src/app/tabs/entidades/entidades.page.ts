import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { EntidadResponse } from '@http/responses';
import { EntidadesCrudService } from '@http/services/entidades';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { PipesModule } from '@shared/pipes';
import { EntidadForm } from './entidad.form';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule, PipesModule],
  selector: 'app-entidades',
  templateUrl: 'entidades.page.html',
  styleUrls: ['entidades.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntidadesPage implements OnInit, OnDestroy {
  public dataSource = new MatTableDataSource<EntidadResponse>([]);
  public filter = new FormControl('');

  public myForm = new EntidadForm();
  public isModalOpen = false;

  private _loading!: HTMLIonLoadingElement;
  private _subs1: Subscription;

  constructor(
    private _entidadesCrud: EntidadesCrudService,
    private _alertController: AlertController,
    private _loadingCtrl: LoadingController,
    private _cd: ChangeDetectorRef
  ) {
    this._subs1 = this.filter.valueChanges.subscribe(_ => {
      this.dataSource.filter = (_ || '').trim().toLowerCase();
    });
  }

  public async ngOnInit(): Promise<void> {
    this._fetchEntidades();
  }

  public refresh() {
    this._fetchEntidades(true);
  }

  public clickOnToggleModal(open: boolean) {
    if (open) {
      this.isModalOpen = true;
    } else {
      this.isModalOpen = false;
      this.myForm.reset();
    }
  }

  public async clickOnEvaluar(entidad: EntidadResponse, e: any) {
    await this._showLoading('Creando nueva evaluación...');

    const result = await this._entidadesCrud.evaluar(entidad, e.detail.value);

    result.fold({
      right: async () => {
        const alert = await this._alertController.create({
          header: 'Estado de la evaluación',
          message: 'Evaluación creada satisfactoriamente',
          buttons: ['OK'],
        });

        await alert.present();
      },
      left: async () => {
        const alert = await this._alertController.create({
          header: 'Estado de la evaluación',
          message: 'Algo salió mal al crear la evaluación',
          buttons: ['OK'],
        });

        await alert.present();
      },
    });

    this._removeLoading();
  }

  public async clickOnRegistrarEntidad() {
    await this._showLoading('Registrando nueva entidad...');

    const result = await this._entidadesCrud.create(this.myForm.model);

    result.fold({
      right: _ => {
        this._removeLoading();

        this.isModalOpen = false;
        this.myForm.reset();
      },
    });
  }

  private async _fetchEntidades(refresh = false) {
    await this._showLoading();

    const result = await this._entidadesCrud.fetch([1], refresh);

    result.fold({
      right: _ => {
        //console.log(_);
        this._instanceDataSource(_);
      },
    });

    this._removeLoading();
  }

  private async _showLoading(message = 'Obteniendo entidades registradas...'): Promise<void> {
    this._loading = await this._loadingCtrl.create({
      message,
    });

    this._loading.present();
    this._cd.markForCheck();
  }

  private _removeLoading(): void {
    this._loading.remove();
    this._cd.markForCheck();
  }

  private _instanceDataSource(data: EntidadResponse[]): void {
    this.dataSource = new MatTableDataSource<EntidadResponse>(data);
    this._cd.markForCheck();
  }

  public ngOnDestroy(): void {
    this._subs1.unsubscribe();
  }
}
