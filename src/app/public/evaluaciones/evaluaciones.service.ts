import { Injectable } from '@angular/core';
import { BaseHttp } from '@shared/bases';
import { END_POINTS } from '@shared/constants';
import { firstValueFrom, map } from 'rxjs';
import { IEvaCalT2 } from './evaluaciones.interfaces';

@Injectable()
export class EvaluacionesService extends BaseHttp {
  getResultados() {
    return firstValueFrom(
      this._http.get<IEvaCalT2[]>(`${END_POINTS.V1.EVALUACIONES}/calificadas`).pipe(
        map(_ =>
          _.map(_ => {
            if ([5, 6].indexOf(_.tipo_id) >= 0) {
              _.nombreEvaluado += ` A ${_.maestro!.nombre_completo}`;
            }
            return _;
          })
        )
      )
    );
  }
}
