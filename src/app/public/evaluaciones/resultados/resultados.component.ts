import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { IEvaCalT2 } from '../evaluaciones.interfaces';
import { CommonModule } from '@angular/common';
import { groupByKey } from '@eklipse/utilities';

@Component({
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatDividerModule],
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
}
