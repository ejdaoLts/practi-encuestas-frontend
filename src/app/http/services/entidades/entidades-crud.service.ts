import { Injectable } from '@angular/core';
import { Either } from '@eklipse/utilities';
import { BehaviorSubject, Observable, firstValueFrom, tap } from 'rxjs';
import { END_POINTS } from '@shared/constants';
import { BaseHttp } from '@shared/bases';
import { EntidadResponse } from '@http/responses';
import { CreateEntidadPayload } from '@http/payloads';

type Result1 = Either<boolean, EntidadResponse[]>;
type Result2 = Either<boolean, EntidadResponse>;
type Result3 = Either<boolean, any>;

@Injectable({ providedIn: 'root' })
export class EntidadesCrudService extends BaseHttp {
  private _entidades = new BehaviorSubject<EntidadResponse[]>([]);
  private _entidades$ = this._entidades.asObservable();

  public async evaluar(entidad: EntidadResponse, tipo: number): Promise<Result3> {
    try {
      const result = await this._evaluar(entidad, tipo);

      return Either.right(result);
    } catch (error) {
      return Either.left(false);
    }
  }

  public async create(payload: CreateEntidadPayload): Promise<Result2> {
    try {
      const result = await this._create(payload);

      return Either.right(result);
    } catch (error) {
      return Either.left(false);
    }
  }

  public async fetch(refresh: boolean): Promise<Result1> {
    try {
      const result = await this._fetch(refresh);

      return Either.right(result);
    } catch (error) {
      return Either.left(false);
    }
  }

  public observable(): Observable<EntidadResponse[] | null> {
    return this._entidades$;
  }

  private async _create(payload: CreateEntidadPayload): Promise<EntidadResponse> {
    return firstValueFrom(
      this._http.post<EntidadResponse>(`${END_POINTS.V1.ENTIDADES}`, payload).pipe(
        tap(entidad => {
          this._entidades.value.unshift(entidad);
          this._entidades.next(this._entidades.value);
        })
      )
    );
  }

  private async _evaluar(entidad: EntidadResponse, tipo: number): Promise<any> {
    return firstValueFrom(
      this._http
        .post<any>(`${END_POINTS.V1.EVALUACIONES}`, {
          tipo_id: tipo,
          entidad_id: entidad.id,
        })
        .pipe(
          tap((result: any) => {
            if (result) {
              this._entidades.value.map(_ => {
                if (_.id === entidad.id) {
                  _.fecha_ultima_evaluacion = new Date().toISOString();
                }

                _.min_time_last_eva_valid = true;

                if (_.fecha_ultima_evaluacion) {
                  const timePast =
                    (new Date() as any) - (new Date(_.fecha_ultima_evaluacion) as any);

                  if (timePast < 432000000) _.min_time_last_eva_valid = false;
                }
              });

              this._entidades.next(this._entidades.value);
            }
          })
        )
    );
  }

  private async _fetch(refresh: boolean): Promise<EntidadResponse[]> {
    if (!refresh && this._entidades.value.length) return this._entidades.value;

    return firstValueFrom(
      this._http.get<EntidadResponse[]>(`${END_POINTS.V1.ENTIDADES}`).pipe(
        tap(entidades => {
          entidades.map(_ => {
            _.min_time_last_eva_valid = true;

            if (_.fecha_ultima_evaluacion) {
              const timePast = (new Date() as any) - (new Date(_.fecha_ultima_evaluacion) as any);

              if (timePast < 432000000) _.min_time_last_eva_valid = false;
            }
          });
          this._entidades.next(entidades);
        })
      )
    );
  }
}
