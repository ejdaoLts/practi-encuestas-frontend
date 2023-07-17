import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { groupByKey, saveAsExcel } from '@eklipse/utilities';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IEvaCalT1, IResultado } from '../evaluaciones.interfaces';

@Component({
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatButtonModule, MatIconModule, MatDividerModule],
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss'],
})
export class ResultadosComponent implements OnInit {
  resultados: any[] = [];

  constructor(
    private _cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { data: IEvaCalT1; customTitle: string | undefined }
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
          condicion: !i ? row.condicion : '',
          aspectoEvaluar: row.aspecto_evaluar,
          observacion: row.observacion,
        });
      });

      data.push({
        '#': '',
        orden: '',
        calificacion: this.calcularCalificacion(_.rows),
        condicion: 'TOTAL',
        aspectoEvaluar: '',
        observacion: '',
      });

      data.push({
        '#': '',
        orden: '',
        calificacion: '',
        condicion: '',
        aspectoEvaluar: '',
        observacion: '',
      });
    });

    data.push({
      '#': '',
      orden: '',
      calificacion: '',
      condicion: '',
      aspectoEvaluar: '',
      observacion: '',
    });

    data.push({
      '#': '',
      orden: '',
      calificacion: this.calcularCalificacionGlobal(),
      condicion: 'TOTAL',
      aspectoEvaluar: '',
      observacion: '',
    });

    saveAsExcel(
      data,
      `EVALUACION ${this.data.data.nombreEvaluado} ${this.data.data.tipo_evaluacion.nombre}`
    );
  }

  calcularCalificacion(rows: IResultado[]) {
    let exp = 0,
      total = 0;

    rows.forEach(_ => {
      if (_.calificacion) {
        exp++;
        total += _.calificacion;
      }
    });

    return +(total / exp).toFixed(2);
  }

  calcularCalificacionGlobal() {
    let aspectos = 0,
      totalAsp = 0;

    this.resultados.forEach(dt => {
      let exp = 0,
        total = 0;

      dt.rows.forEach((_: any) => {
        if (_.calificacion) {
          exp++;
          total += _.calificacion;
        }
      });

      aspectos++;
      totalAsp += total / exp;
    });

    return +(totalAsp / aspectos).toFixed(2);
  }
}
