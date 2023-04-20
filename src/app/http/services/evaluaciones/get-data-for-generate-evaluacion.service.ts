import { Injectable } from '@angular/core';
import { Either } from '@eklipse/utilities';
import { firstValueFrom, map } from 'rxjs';
import { orderBy } from 'lodash';
import { PuntoEvaluacionT1 } from '@http/dtos/evaluaciones';
import { EvaluacionDataT1Response } from '@http/responses';
import { TiposEvaluacion } from '@http/constants';
import { END_POINTS } from '@shared/constants';
import { BaseHttp } from '@shared/bases';

type Result1 = Either<boolean, PuntoEvaluacionT1[]>;

@Injectable({ providedIn: 'root' })
export class GetDataForGenerateEvaluacionService extends BaseHttp {
  //private _dataForEvaluacionTipo1!: PuntoEvaluacionT1[];

  public async execute(tipo: TiposEvaluacion): Promise<Result1> {
    try {
      let result: any;

      if (tipo === TiposEvaluacion.T1) {
        //if (!this._dataForEvaluacionTipo1) {
        result = await this._getEvaTipo1();
        //  this._dataForEvaluacionTipo1 = result;
        //} else {
        //  result = this._dataForEvaluacionTipo1;
        //}
      }

      return Either.right(result);
    } catch (error) {
      return Either.left(false);
    }
  }

  private _getEvaTipo1(): Promise<PuntoEvaluacionT1[]> {
    return firstValueFrom(
      this._http
        .get<EvaluacionDataT1Response[]>(`${END_POINTS.V1.EVALUACIONES}/data/1`)
        .pipe(map(_ => this._mapEvaTipo1(_)))
    );
  }

  private _mapEvaTipo1(_: EvaluacionDataT1Response[]): PuntoEvaluacionT1[] {
    const puntos: PuntoEvaluacionT1[] = [];
    let i = 1;

    const grupos = orderBy(_, 'orden', 'asc');

    grupos.forEach(grupo => {
      grupo.aspectos_evaluacion.forEach(aspecto => {
        puntos.push({
          id: aspecto.id,
          orden: i,
          nombre: aspecto.nombre,
          documental: aspecto.documental,
          grupo: {
            id: grupo.id,
            orden: grupo.orden,
            descripcion: grupo.descripcion,
          },
          inspeccionVisual: false,
          revisionDocumental: false,
          entrevistaActores: false,
          valoracionCondicion: null,
          observaciones: '',
        });

        i++;
      });
    });

    return orderBy(puntos, 'orden', 'asc');
  }
}