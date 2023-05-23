import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { EntidadResponse } from '@http/responses';
import { PersonasCrudService } from '@http/services/entidades';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { PersonaForm } from './persona.form';
import { PipesModule } from '@shared/pipes';
import { GcmAutocompleteField } from './autocomplete-field';
import { EvaluacionForm } from './evaluacion.form';
import { GcmMaestrosAutocompleteField } from './maestros-autocomplete';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    GcmAutocompleteField,
    GcmMaestrosAutocompleteField,
    ReactiveFormsModule,
    PipesModule,
  ],
  selector: 'app-personas',
  templateUrl: 'personas.page.html',
  styleUrls: ['personas.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonasPage implements OnInit, OnDestroy {
  public dataSource = new MatTableDataSource<EntidadResponse>([]);
  public filter = new FormControl('');

  public myForm = new PersonaForm();
  public myEvalForm = new EvaluacionForm();
  public isModalOpen = false;
  public isModalGenEvaOpen = false;

  public personaSelected!: EntidadResponse;

  customForm = new FormControl();

  private _loading!: HTMLIonLoadingElement;
  private _subs1: Subscription;

  constructor(
    private _personasCrud: PersonasCrudService,
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
      this.myForm.resett();
    }
  }

  public clickOnToggleGenEvaModal(open: boolean, persona?: EntidadResponse) {
    if (open) {
      this.personaSelected = persona!;
      this.isModalGenEvaOpen = true;
    } else {
      this.isModalGenEvaOpen = false;
      this.myEvalForm.resett();
    }
  }

  /*   public async clickOnGenerarEvaluacion(entidad: EntidadResponse) {
    console.log(entidad);
    console.log(this.myEvalForm.value);
    //this.isModalGenEvaOpen = true;
  } */

  public async clickOnEvaluar(entidad: EntidadResponse) {
    await this._showLoading('Creando nueva evaluación...');

    const result = await this._personasCrud.evaluar(entidad, this.myEvalForm.model);

    result.fold({
      right: async () => {
        const alert = await this._alertController.create({
          header: 'Estado de la evaluación',
          message: 'Evaluación creada satisfactoriamente',
          buttons: ['OK'],
        });

        this.isModalGenEvaOpen = false;
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

    const result = await this._personasCrud.create(this.myForm.model);

    result.fold({
      right: _ => {
        this._removeLoading();

        this.isModalOpen = false;
        this.myForm.resett();
      },
      left: _ => {
        this._removeLoading();
        this._alertNotCreated();
      },
    });
  }

  private async _fetchEntidades(refresh = false) {
    await this._showLoading();

    const result = await this._personasCrud.fetch([2, 3, 4, 5, 6], refresh);

    result.fold({
      right: _ => {
        this._instanceDataSource(_);
      },
    });

    this._removeLoading();
  }

  private async _alertNotCreated() {
    const alert = await this._alertController.create({
      header: 'Estado de la entidad',
      message: 'Error al crear entidad, puede que ya exista un usuario con este documento',
      buttons: ['OK'],
    });

    await alert.present();
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
