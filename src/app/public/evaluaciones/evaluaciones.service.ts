import { Injectable } from '@angular/core';
import { BaseHttp } from '@shared/bases';
import { END_POINTS } from '@shared/constants';
import { BehaviorSubject, Observable, firstValueFrom, map, tap } from 'rxjs';
import { IEvaCalT2 } from './evaluaciones.interfaces';
import { DATA } from './mok';

@Injectable()
export class EvaluacionesService extends BaseHttp {
  private _subject = new BehaviorSubject<{ data: IEvaCalT2[]; lastUpdate: Date | null }>({
    data: [],
    lastUpdate: null,
  });

  private _observable$ = this._subject.asObservable();

  public async getResultados(refresh: boolean): Promise<IEvaCalT2[]> {
    if (!refresh && this._subject.value.lastUpdate) return this._subject.value.data;

    return firstValueFrom(
      this._http
        .get<IEvaCalT2[]>(`${END_POINTS.V1.EVALUACIONES}/calificadas`) /*(
        DATA as any as Observable<IEvaCalT2[]>
      )*/
        .pipe(
          map(_2 =>
            _2.map(_ => {
              if ([5, 6].indexOf(_.tipo_id) >= 0) {
                _.nombreEvaluado += ` POR ${_.maestro!.nombre_completo}`;
              }
              _.nombreEntidad = _.entidad.entidad ? _.entidad.entidad.nombre_completo : null;
              return _;
            })
          ),
          tap(_ => {
            this._subject.next({ data: _, lastUpdate: new Date() });
          })
        )
    );
  }

  public observable() {
    return this._observable$;
  }
}
