import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { IEvaCalT2 } from '../evaluaciones.interfaces';
import { CommonModule } from '@angular/common';
import { groupByKey, saveAsExcel } from '@eklipse/utilities';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { result } from 'lodash';

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
          condicion: !i ? row.condicion : '',
          aspectoEvaluar: row.aspecto_evaluar,
          calificacion: row.calificacion,
        });
      });
    });

    data.push({
      '#': '',
      orden: '',
      condicion: '',
      aspectoEvaluar: '',
      calificacion: '',
    });

    this.data.data.preguntasLibres.forEach((_, i) => {
      data.push({
        '#': i + 1,
        orden: '',
        condicion: '',
        aspectoEvaluar: _.pta,
        calificacion: _.rta,
      });
    });
    saveAsExcel(
      data,
      `EVALUACION ${this.data.data.nombreEvaluado} ${this.data.data.tipo_evaluacion.nombre}`
    );
  }
}
