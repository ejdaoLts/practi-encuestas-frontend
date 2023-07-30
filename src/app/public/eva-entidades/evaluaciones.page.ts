import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EvaluacionesService } from './evaluaciones.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { GcmTablesModule } from '@eklipse/components/tables';
import { PipesModule } from '@shared/pipes';
import { MatIconModule } from '@angular/material/icon';
import { GcmFieldsModule } from '@eklipse/components/fields';
import { ResultadosComponent } from './resultados/resultados.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { groupByKey, saveAsExcel } from '@eklipse/utilities';
import { cloneDeep, orderBy } from 'lodash';
import { MatButtonModule } from '@angular/material/button';
import { GcmAreaModule, GcmStackedBarModule } from '@common/charts';
import { generarGraficas, generarGraficasCondiciones } from './evaluaciones.functions';
import { IEvaCalT1 } from './evaluaciones.interfaces';

@Component({
  standalone: true,
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.page.html',
  styleUrls: ['./evaluaciones.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    GcmTablesModule,
    GcmFieldsModule,
    MatIconModule,
    PipesModule,
    MatDialogModule,
    ResultadosComponent,
    GcmAreaModule,
    GcmStackedBarModule,
  ],
  providers: [EvaluacionesService],
})
export class EvaluacionesPage implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  public dataSource = new MatTableDataSource<IEvaCalT1>([]);
  public filtro = new FormControl('');
  public displayedColumns = ['id', 'tipoEval', 'nombreEvaluado'];
  public expandedElement: any;
  public isLoading = false;

  public tiposEvaluaciones: any[] = [];
  public calificacionesCondiciones: any;

  public grafica: any;
  public graficaRegenerada = false;

  private _unsubscribe$ = new Subject<void>();

  constructor(
    private _services: EvaluacionesService,
    private _dialog: MatDialog,
    private _cd: ChangeDetectorRef
  ) {
    this.filtro.valueChanges.pipe(takeUntil(this._unsubscribe$)).subscribe(_ => {
      this.dataSource.filter = _ ? _.trim().toLowerCase() : '';
    });
  }

  async ngOnInit() {
    this._services.observable().subscribe(_ => {
      this._instanceDataSource(_.data);
      this._generateEstadisticas(_.data);
      this.calificacionesCondiciones = generarGraficasCondiciones(_.data);
      if (_.lastUpdate) this.grafica = generarGraficas(_.data);
    });

    try {
      await this._services.getResultados(false);
    } catch (error) {}
  }

  public fetchByOrden(labels: number[]) {
    const ast: any = [];
    labels.forEach(d => {
      const dt = this.grafica.aspectosEvaluados.filter((_: any) => _.key === d);
      if (dt.length) ast.push(dt[0]);
    });

    return ast;
  }

  public onChangeTabs() {
    this.graficaRegenerada = false;

    setTimeout(() => {
      this.graficaRegenerada = true;
      this._cd.markForCheck();
    }, 500);
  }

  public onExportExcel() {
    const data = cloneDeep(this.dataSource.filteredData);

    const d = data.map(_ => {
      return {
        tipoEvaluacion: _.tipo_evaluacion.id,
        nombreEvaluacion: _.tipo_evaluacion.nombre,
        usuarioEvaluado: _.nombreEvaluado,
        creadaPor: _.nombreEvaluador,
      };
    });
    saveAsExcel(d);
  }

  private _instanceDataSource(data: IEvaCalT1[]): void {
    this.dataSource = new MatTableDataSource<IEvaCalT1>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public clickOnConciliacion(data: any) {
    /* const dialog = */ this._dialog.open(ResultadosComponent, {
      width: '80vw',
      height: '90vh',
      maxWidth: '600px',
      maxHeight: '650px',
      data: { data },
    });
    /* dialog.afterClosed().subscribe(data => {
      if (data) this.editConciliacion.emit(conciliacion);
    }); */
  }

  private _generateEstadisticas(data: IEvaCalT1[]) {
    const groupedByEntidad = groupByKey(data, 'nombreEntidad');

    groupedByEntidad.forEach(byEnt => {
      const groupedByTipoEval = groupByKey(byEnt.rows, 'tipoEval');
      const groupedByTipoEvalOrdered = orderBy(groupedByTipoEval, 'key');

      const values: any[] = [];

      groupedByTipoEvalOrdered.forEach(_ => {
        const ft = {
          total: `${_.rows.length} EVALUACIONES`,
          tipo: _.rows[0].tipo_evaluacion.nombre,
          nombreTipo: _.rows[0].tipo_evaluacion.nombre,
          rows: _.rows,
        };

        values.push(ft);
      });

      this.tiposEvaluaciones.push(values);
    });
  }

  public clickOnEvaluacionesGrouped(rows: IEvaCalT1[]) {
    const data = cloneDeep(rows);
    const firstValue = data[0].resultados;

    data.forEach((_, i) => {
      if (i > 0) {
        _.resultados.forEach(resultado => {
          firstValue.filter(val => val.orden === resultado.orden)[0].calificacion +=
            resultado.calificacion;
        });
      }
    });

    firstValue.map(_ => {
      _.calificacion = +(_.calificacion / data.length).toFixed(2);
    });

    this._dialog.open(ResultadosComponent, {
      width: '80vw',
      height: '90vh',
      maxWidth: '600px',
      maxHeight: '650px',
      data: {
        data: { resultados: firstValue },
        customTitle: `${rows[0].tipo_evaluacion.nombre}, PROMEDIADO DE ${
          rows.length
        } EVALUACIONES (${rows[0].nombreEvaluado || 'NO PERTENECE A NINGUNA ENTIDAD'})`,
      },
    });
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
