import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EvaluacionesService } from './evaluaciones.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IEvaCalT2 } from './evaluaciones.interfaces';
import { Subject, takeUntil } from 'rxjs';
import { GcmTablesModule } from '@eklipse/components/tables';
import { PipesModule } from '@shared/pipes';
import { MatIconModule } from '@angular/material/icon';
import { GcmFieldsModule } from '@eklipse/components/fields';
import { ResultadosComponent } from './resultados/resultados.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.page.html',
  styleUrls: ['./evaluaciones.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GcmTablesModule,
    GcmFieldsModule,
    MatIconModule,
    PipesModule,
    MatDialogModule,
    ResultadosComponent,
  ],
  providers: [EvaluacionesService],
})
export class EvaluacionesPage implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  public dataSource = new MatTableDataSource<IEvaCalT2>([]);
  public filtro = new FormControl('');
  public displayedColumns = ['id', 'tipoEval', 'nombreEvaluado'];
  public expandedElement: any;
  public isLoading = false;

  private _unsubscribe$ = new Subject<void>();

  constructor(private _services: EvaluacionesService, private _dialog: MatDialog) {
    this.filtro.valueChanges.pipe(takeUntil(this._unsubscribe$)).subscribe(_ => {
      this.dataSource.filter = _ ? _.trim().toLowerCase() : '';
    });
  }

  async ngOnInit() {
    try {
      const result = await this._services.getResultados();
      console.log(result);
      this._instanceDataSource(result);
    } catch (error) {}
  }

  private _instanceDataSource(data: IEvaCalT2[]): void {
    this.dataSource = new MatTableDataSource<IEvaCalT2>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public clickOnConciliacion(d: any) {
    const dialog = this._dialog.open(ResultadosComponent, {
      width: '80vw',
      height: '90vh',
      maxWidth: '600px',
      maxHeight: '650px',
      data: d,
    });
    /* dialog.afterClosed().subscribe(data => {
      if (data) this.editConciliacion.emit(conciliacion);
    }); */
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
