import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { EntidadResponse } from '@http/responses';
import { EntidadesCrudService } from '@http/services/entidades';
import { IonicModule, LoadingController } from '@ionic/angular';
import { PipesModule } from '@shared/pipes';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, PipesModule],
  selector: 'app-entidades',
  templateUrl: 'entidades.page.html',
  styleUrls: ['entidades.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntidadesPage implements OnInit, OnDestroy {
  public dataSource = new MatTableDataSource<EntidadResponse>([]);
  public filter = new FormControl('');

  private _loading!: HTMLIonLoadingElement;
  private _subs1: Subscription;

  constructor(
    private _entidadesCrud: EntidadesCrudService,
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

  public add() {
    console.log('hey');
  }

  private async _fetchEntidades(refresh = false) {
    await this._showLoading();

    const result = await this._entidadesCrud.fetch(refresh);

    result.fold({
      right: _ => {
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
  }

  private _removeLoading(): void {
    this._loading.remove();
  }

  private _instanceDataSource(data: EntidadResponse[]): void {
    this.dataSource = new MatTableDataSource<EntidadResponse>(data);
    this._cd.markForCheck();
  }

  public ngOnDestroy(): void {
    this._subs1.unsubscribe();
  }
}
