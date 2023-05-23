import { Injectable } from '@angular/core';
import { Either } from '@eklipse/utilities';
import { firstValueFrom } from 'rxjs';
import { cloneDeep } from 'lodash';
import {
  EvaluacionPendienteDto,
  PuntoEvaluacionT1,
  PuntoEvaluacionT2,
} from '@http/dtos/evaluaciones';
import { TiposEvaluacion } from '@http/constants';
import { END_POINTS } from '@shared/constants';
import { BaseHttp } from '@shared/bases';
import { PuntoEvaluacionT1Payload, PuntoEvaluacionT2Payload } from '@http/payloads';

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
      if ([2, 3, 4, 5, 6, 7, 8].indexOf(tipo) >= 0) {
        result = await this._califiEvalT2OrT3(data, evaluacion, tipo);
      }

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

  private _califiEvalT2OrT3(
    puntosEvaluados: PuntoEvaluacionT2[],
    evaluacion: EvaluacionPendienteDto,
    tipo: TiposEvaluacion
  ): Promise<any[]> {
    const payload: PuntoEvaluacionT2Payload[] = puntosEvaluados.map(_ => {
      return {
        eva_id: evaluacion.id,
        aspva_id: _.id,
        nivel_acuerdo: _.gradoAcuerdo!,
      };
    });

    return firstValueFrom(
      this._http.post<any[]>(`${END_POINTS.V1.EVALUACIONES}/t${tipo}/calificar`, payload)
    );
  }
}
