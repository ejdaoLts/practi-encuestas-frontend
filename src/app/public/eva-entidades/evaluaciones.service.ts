import { Injectable } from '@angular/core';
import { BaseHttp } from '@shared/bases';
import { BehaviorSubject, firstValueFrom, map, tap } from 'rxjs';
import { IEvaCalT1 } from './evaluaciones.interfaces';
import { END_POINTS } from '@shared/constants';

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
          map(_ =>
            _.map(_ => {
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
