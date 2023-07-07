import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { IEvaCalT2 } from '../evaluaciones.interfaces';
import { CommonModule } from '@angular/common';
import { groupByKey, saveAsExcel } from '@eklipse/utilities';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { result } from 'lodash';
import { PipesModule } from '@shared/pipes';

@Component({
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    MatButtonModule,
    PipesModule,
    MatIconModule,
    MatDividerModule,
  ],
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss'],
})
export class ResultadosComponent implements OnInit {
  resultados: any[] = [];

  constructor(
    private _dialogRef: MatDialogRef<ResultadosComponent>,
    private _cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { data: IEvaCalT2; customTitle: string | undefined }
  ) {}

  ngOnInit(): void {
    this.resultados = groupByKey(this.data.data.resultados, 'condicion');
    this._cd.markForCheck();
  }

  onExportExcel() {
    let data: any = [];

    this.resultados.forEach(_ => {
      _.rows.forEach((row: any, i: number) => {
        data.push({
          '#': row.orden,
          orden: i + 1,
          calificacion: row.calificacion,
          cumplimiento: (row.calificacion * 100) / 5,
          //condicion: !i ? row.condicion : '',
          condicion: row.condicion,
          aspectoEvaluar: row.aspecto_evaluar,
        });
      });

      data.push({
        '#': '',
        orden: '',
        calificacion: '',
        cumplimiento: '',
        condicion: '',
        aspectoEvaluar: '',
      });
    });

    data.push({
      '#': '',
      orden: '',
      calificacion: '',
      cumplimiento: '',
      condicion: '',
      aspectoEvaluar: '',
    });

    if (this.data.data.preguntasLibres) {
      this.data.data.preguntasLibres.forEach((_, i) => {
        data.push({
          '#': i + 1,
          orden: '',
          calificacion: '',
          cumplimiento: '',
          condicion: _.pta,
          aspectoEvaluar: _.rta,
        });
      });
    }

    const title =
      this.data.data.nombreEvaluado && this.data.data.tipo_evaluacion.nombre
        ? `EVALUACION ${this.data.data.nombreEvaluado} ${this.data.data.tipo_evaluacion.nombre}`
        : this.data.customTitle;

    saveAsExcel(data, `EVALUACION ${title}`);
  }
}
