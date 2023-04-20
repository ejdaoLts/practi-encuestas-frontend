import { Injectable } from '@angular/core';
import { Either } from '@eklipse/utilities';
import { firstValueFrom } from 'rxjs';
import { TipoEvaluacionDto } from '@http/dtos';
import { END_POINTS } from '@shared/constants';
import { BaseHttp } from '@shared/bases';

type Result = Either<boolean, TipoEvaluacionDto[]>;

@Injectable({ providedIn: 'root' })
export class GetTiposEvaluacionService extends BaseHttp {
  public async execute(): Promise<Result> {
    try {
      const result = await this._get();

      return Either.right(result);
    } catch (error) {
      return Either.left(false);
    }
  }

  private _get() {
    return firstValueFrom(
      this._http.get<TipoEvaluacionDto[]>(`${END_POINTS.V1.EVALUACIONES}/tipos`)
    );
  }
}
