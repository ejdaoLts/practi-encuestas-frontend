import { Injectable } from '@angular/core';
import { BaseHttp } from '@shared/bases';
import { BehaviorSubject, Observable, firstValueFrom, map, tap } from 'rxjs';
import { ICalCondicion, IEvaCalT1 } from './evaluaciones.interfaces';
import { END_POINTS } from '@shared/constants';
import { DATA } from './mok';
import { cloneDeep } from 'lodash';
import { groupByKey, orderBy } from '@eklipse/utilities';
import { calcularCalificacionCondicion } from './evaluaciones.functions';

@Injectable()
export class EvaluacionesService extends BaseHttp {
  private _subject = new BehaviorSubject<{ data: IEvaCalT1[]; lastUpdate: Date | null }>({
    data: [],
    lastUpdate: null,
  });

  private _observable$ = this._subject.asObservable();

  public async getResultados(refresh: boolean): Promise<IEvaCalT1[]> {
    if (!refresh && this._subject.value.lastUpdate) return this._subject.value.data;

    return firstValueFrom(
      this._http
        .get<IEvaCalT1[]>(`${END_POINTS.V1.EVALUACIONES}/calificadas/t1`) /*(
        DATA as any as Observable<IEvaCalT1[]>
      )*/
        .pipe(
          map(res1 =>
            res1.map(res2 => {
              const resultadosGrouped = groupByKey(cloneDeep(res2.resultados), 'condicion');

              const calificaciones: ICalCondicion[] = [];

              resultadosGrouped.forEach(resultado => {
                calificaciones.push({
                  nombre: resultado.name,
                  calificacion: calcularCalificacionCondicion(resultado.rows),
                });
              });

              res2.calificacionFinal = 0;
              res2.resultadosCondiciones = calificaciones;

              calificaciones.forEach(cal => {
                res2.calificacionFinal += cal.calificacion;
              });

              res2.calificacionFinal = +(res2.calificacionFinal / calificaciones.length).toFixed(2);

              return res2;
            })
          ),
          tap(_ => {
            const finallyD = orderBy(_, 'nombreEvaluado', 'asc');
            this._subject.next({ data: finallyD, lastUpdate: new Date() });
          })
        )
    );
  }

  public observable() {
    return this._observable$;
  }
}
