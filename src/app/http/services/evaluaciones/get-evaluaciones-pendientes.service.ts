import { Injectable } from '@angular/core';
import { Either } from '@eklipse/utilities';
import { firstValueFrom, map } from 'rxjs';
import { EvaluacionPendienteDto } from '@http/dtos';
import { END_POINTS } from '@shared/constants';
import { BaseHttp } from '@shared/bases';
import { _MatTableDataSource } from '@angular/material/table';
import { orderBy } from 'lodash';

type Result = Either<boolean, EvaluacionPendienteDto[]>;

@Injectable({ providedIn: 'root' })
export class GetEvaluacionesPendientesService extends BaseHttp {
  public async execute(onlyMe = true, onlyPendientes = true): Promise<Result> {
    try {
      const result = await this._get(onlyMe, onlyPendientes);

      return Either.right(orderBy(result, 'created_at', 'desc'));
    } catch (error) {
      return Either.left(false);
    }
  }

  private _get(onlyMe: boolean, onlyPendientes: boolean): Promise<EvaluacionPendienteDto[]> {
    return firstValueFrom(
      this._http
        .get<EvaluacionPendienteDto[]>(
          `${END_POINTS.V1.EVALUACIONES}/all/${onlyMe ? 1 : 0}/${onlyPendientes ? 1 : 0}`
        )
        .pipe(map(_ => _.map(_2 => this._map(_2))))
    );
  }

  private _map(_: EvaluacionPendienteDto) {
    _.nombreTipoEvaluacion = _.tipo_evaluacion.nombre;
    _.nombreEntidad = _.entidad.nombre_completo;
    _.created_at = new Date(_.created_at);
    _.last_update = _.last_update ? new Date(_.last_update) : null;

    return _;
  }
}
