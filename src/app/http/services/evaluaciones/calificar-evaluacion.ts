import { Injectable } from '@angular/core';
import { Either } from '@eklipse/utilities';
import { firstValueFrom, map } from 'rxjs';
import { cloneDeep, orderBy } from 'lodash';
import { EvaluacionPendienteDto, PuntoEvaluacionT1 } from '@http/dtos/evaluaciones';
import { TiposEvaluacion } from '@http/constants';
import { END_POINTS } from '@shared/constants';
import { BaseHttp } from '@shared/bases';
import { PuntoEvaluacionT1Payload } from '@http/payloads';

type Result1 = Either<boolean, any[]>;

@Injectable({ providedIn: 'root' })
export class CalificarEvaluacionService extends BaseHttp {
  public async execute(
    tipo: TiposEvaluacion,
    evaluacion: EvaluacionPendienteDto,
    data: any
  ): Promise<Result1> {
    try {
      let result: any;

      if (tipo === TiposEvaluacion.T1) result = await this._calificarEvalT1(data, evaluacion);

      return Either.right(cloneDeep(result));
    } catch (error) {
      return Either.left(false);
    }
  }

  private _calificarEvalT1(
    puntosEvaluados: PuntoEvaluacionT1[],
    evaluacion: EvaluacionPendienteDto
  ): Promise<any[]> {
    const payload: PuntoEvaluacionT1Payload[] = puntosEvaluados.map(_ => {
      return {
        eva_id: evaluacion.id,
        cond_id: _.grupo.id,
        aspva_id: _.id,
        tv_visual: _.inspeccionVisual,
        tv_documental: _.revisionDocumental,
        tv_entrevista: _.entrevistaActores,
        val_cond: _.valoracionCondicion!,
        observacion: _.observaciones,
      };
    });

    return firstValueFrom(
      this._http.post<any[]>(`${END_POINTS.V1.EVALUACIONES}/t1/calificar`, payload)
    );
  }
}
