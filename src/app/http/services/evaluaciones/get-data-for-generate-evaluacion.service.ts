import { Injectable } from '@angular/core';
import { Either } from '@eklipse/utilities';
import { firstValueFrom, map } from 'rxjs';
import { cloneDeep, orderBy } from 'lodash';
import { PuntoEvaluacionT1 } from '@http/dtos/evaluaciones';
import { EvaluacionDataT1Response } from '@http/responses';
import { TiposEvaluacion } from '@http/constants';
import { END_POINTS } from '@shared/constants';
import { BaseHttp } from '@shared/bases';
import { PuntoEvaluacionT2 } from '@http/dtos/evaluaciones';

type Result1 = Either<boolean, PuntoEvaluacionT1[]>;

@Injectable({ providedIn: 'root' })
export class GetDataForGenerateEvaluacionService extends BaseHttp {
  private _dataForEvaluacionTipo1!: PuntoEvaluacionT1[];
  private _dataForEvaluacionTipo2!: PuntoEvaluacionT2[];
  private _dataForEvaluacionTipo3!: PuntoEvaluacionT2[];

  public async execute(tipo: TiposEvaluacion): Promise<Result1> {
    try {
      let result: any;

      if (tipo === TiposEvaluacion.T1) {
        if (!this._dataForEvaluacionTipo1) {
          result = await this._getEvaTipo1();
          this._dataForEvaluacionTipo1 = result;
        } else {
          result = this._dataForEvaluacionTipo1;
        }
      }

      if ([TiposEvaluacion.T2].indexOf(tipo) >= 0) {
        if (!this._dataForEvaluacionTipo2) {
          result = await this._getEvaTipo2Or3(tipo);
          this._dataForEvaluacionTipo2 = result;
        } else {
          result = this._dataForEvaluacionTipo2;
        }
      }

      if ([TiposEvaluacion.T3].indexOf(tipo) >= 0) {
        if (!this._dataForEvaluacionTipo3) {
          result = await this._getEvaTipo2Or3(tipo);
          this._dataForEvaluacionTipo3 = result;
        } else {
          result = this._dataForEvaluacionTipo3;
        }
      }

      return Either.right(cloneDeep(result));
    } catch (error) {
      return Either.left(false);
    }
  }

  private _getEvaTipo1(): Promise<PuntoEvaluacionT1[]> {
    return firstValueFrom(
      this._http
        .get<EvaluacionDataT1Response[]>(`${END_POINTS.V1.EVALUACIONES}/data/1`)
        .pipe(map(_ => this._mapEvaTipo1(_)))
    );
  }

  private _getEvaTipo2Or3(tipo: TiposEvaluacion): Promise<PuntoEvaluacionT2[]> {
    return firstValueFrom(
      this._http
        .get<EvaluacionDataT1Response[]>(`${END_POINTS.V1.EVALUACIONES}/data/${tipo}`)
        .pipe(map(_ => this._mapEvaTipo2(_)))
    );
  }

  private _mapEvaTipo1(_: EvaluacionDataT1Response[]): PuntoEvaluacionT1[] {
    const puntos: PuntoEvaluacionT1[] = [];
    let i = 1;

    const grupos = orderBy(_, 'orden', 'asc');

    grupos.forEach(grupo => {
      const ramdon = false;

      const inVis = ramdon ? this.getRandomBoolean() : false;
      const revDoc = ramdon ? this.getRandomBoolean() : false;
      const entAct = ramdon ? this.getRandomBoolean() : false;
      const valCon = ramdon ? this.getRandom() : null;
      const obs = ramdon ? `${inVis} ${revDoc} ${entAct} ${valCon}` : null;

      grupo.aspectos_evaluacion.forEach(aspecto => {
        puntos.push({
          id: aspecto.id,
          orden: i,
          nombre: aspecto.nombre,
          documental: aspecto.documental,
          grupo: {
            id: grupo.id,
            orden: grupo.orden,
            descripcion: grupo.descripcion,
          },
          inspeccionVisual: inVis,
          revisionDocumental: revDoc,
          entrevistaActores: entAct,
          valoracionCondicion: valCon,
          observaciones: obs,
        });

        i++;
      });
    });

    return orderBy(puntos, 'orden', 'asc');
  }

  private _mapEvaTipo2(_: EvaluacionDataT1Response[]): PuntoEvaluacionT2[] {
    const puntos: PuntoEvaluacionT2[] = [];
    let i = 1;

    const grupos = orderBy(_, 'orden', 'asc');

    grupos.forEach(grupo => {
      grupo.aspectos_evaluacion.forEach(aspecto => {
        puntos.push({
          id: aspecto.id,
          orden: i,
          nombre: aspecto.nombre,
          grupo: {
            id: grupo.id,
            orden: grupo.orden,
            descripcion: grupo.descripcion,
          },
          gradoAcuerdo: 5,
        });

        i++;
      });
    });

    return orderBy(puntos, 'orden', 'asc');
  }

  private getRandom(min = 1, max = 4) {
    return Math.round(Math.random() * (max - min) + min);
  }

  private getRandomBoolean(min = 0, max = 1) {
    const _ = Math.random() * (max - min) + min;

    if (!Math.round(_)) return false;
    else return true;
  }
}
