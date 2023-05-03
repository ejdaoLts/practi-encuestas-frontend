import { Injectable } from '@angular/core';
import { Either } from '@eklipse/utilities';
import { BehaviorSubject, Observable, firstValueFrom, tap } from 'rxjs';
import { END_POINTS } from '@shared/constants';
import { BaseHttp } from '@shared/bases';
import { EntidadResponse } from '@http/responses';

type Result1 = Either<boolean, EntidadResponse[]>;

@Injectable({ providedIn: 'root' })
export class EntidadesCrudService extends BaseHttp {
  private _entidades = new BehaviorSubject<EntidadResponse[]>([]);
  private _entidades$ = this._entidades.asObservable();

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

  private async _fetch(refresh: boolean): Promise<EntidadResponse[]> {
    if (!refresh && this._entidades.value.length) return this._entidades.value;

    return firstValueFrom(
      this._http
        .get<EntidadResponse[]>(`${END_POINTS.V1.ENTIDADES}`)
        .pipe(tap(entidades => this._entidades.next(entidades)))
    );
  }
}
