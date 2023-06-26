import { Injectable } from '@angular/core';
import { Either } from '@eklipse/utilities';
import { firstValueFrom, map } from 'rxjs';
import { cloneDeep, orderBy } from 'lodash';
import { DataForEvaT1, DataForEvaT2, PuntoEvaluacionT1 } from '@http/dtos/evaluaciones';
import { EvaluacionDataT1Response } from '@http/responses';
import { TiposEvaluacion as TIPEVA } from '@http/constants';
import { END_POINTS } from '@shared/constants';
import { BaseHttp } from '@shared/bases';
import { PuntoEvaluacionT2 } from '@http/dtos/evaluaciones';
import { gaea } from './generate-aspecto-evaluar-auto';

type Result1 = Either<boolean, DataForEvaT2>;

@Injectable({ providedIn: 'root' })
export class GetDataForGenerateEvaluacionService extends BaseHttp {
  private _dataForEvaluacionTipo1!: PuntoEvaluacionT1[];
  private _dataForEvaluacionTipo2!: PuntoEvaluacionT2[];
  private _dataForEvaluacionTipo3!: PuntoEvaluacionT2[];
  private _dataForEvaluacionTipo4!: PuntoEvaluacionT2[];
  private _dataForEvaluacionTipo5!: PuntoEvaluacionT2[];
  private _dataForEvaluacionTipo6!: PuntoEvaluacionT2[];
  private _dataForEvaluacionTipo7!: PuntoEvaluacionT2[];
  private _dataForEvaluacionTipo8!: PuntoEvaluacionT2[];

  public async execute(tipo: TIPEVA): Promise<Result1> {
    try {
      let result: any;

      if (tipo === TIPEVA.T1) {
        if (!this._dataForEvaluacionTipo1) {
          result = await this._getEvaTipo1();
          this._dataForEvaluacionTipo1 = result;
        } else {
          result = this._dataForEvaluacionTipo1;
        }
      }

      if ([TIPEVA.T2].indexOf(tipo) >= 0) {
        if (!this._dataForEvaluacionTipo2) {
          result = await this._getEvaTipos(tipo);
          this._dataForEvaluacionTipo2 = result;
        } else {
          result = this._dataForEvaluacionTipo2;
        }
      }

      if ([TIPEVA.T3].indexOf(tipo) >= 0) {
        if (!this._dataForEvaluacionTipo3) {
          result = await this._getEvaTipos(tipo);
          this._dataForEvaluacionTipo3 = result;
        } else {
          result = this._dataForEvaluacionTipo3;
        }
      }
      if ([TIPEVA.T4].indexOf(tipo) >= 0) {
        if (!this._dataForEvaluacionTipo4) {
          result = await this._getEvaTipos(tipo);
          this._dataForEvaluacionTipo4 = result;
        } else {
          result = this._dataForEvaluacionTipo4;
        }
      }
      if ([TIPEVA.T5].indexOf(tipo) >= 0) {
        if (!this._dataForEvaluacionTipo5) {
          result = await this._getEvaTipos(tipo);
          this._dataForEvaluacionTipo5 = result;
        } else {
          result = this._dataForEvaluacionTipo5;
        }
      }
      if ([TIPEVA.T6].indexOf(tipo) >= 0) {
        if (!this._dataForEvaluacionTipo6) {
          result = await this._getEvaTipos(tipo);
          this._dataForEvaluacionTipo6 = result;
        } else {
          result = this._dataForEvaluacionTipo6;
        }
      }
      if ([TIPEVA.T7].indexOf(tipo) >= 0) {
        if (!this._dataForEvaluacionTipo7) {
          result = await this._getEvaTipos(tipo);
          this._dataForEvaluacionTipo7 = result;
        } else {
          result = this._dataForEvaluacionTipo7;
        }
      }
      if ([TIPEVA.T8].indexOf(tipo) >= 0) {
        if (!this._dataForEvaluacionTipo8) {
          result = await this._getEvaTipos(tipo);
          this._dataForEvaluacionTipo8 = result;
        } else {
          result = this._dataForEvaluacionTipo8;
        }
      }

      return Either.right(cloneDeep(result));
    } catch (error) {
      return Either.left(false);
    }
  }

  private _getEvaTipo1(): Promise<DataForEvaT1> {
    return firstValueFrom(
      this._http
        .get<EvaluacionDataT1Response[]>(`${END_POINTS.V1.EVALUACIONES}/data/1`)
        .pipe(map(_ => this._mapEvaTipo1(_)))
    );
  }

  private _getEvaTipos(tipo: TIPEVA): Promise<DataForEvaT2> {
    return firstValueFrom(
      this._http
        .get<any[]>(`${END_POINTS.V1.EVALUACIONES}/data/${tipo}`)
        .pipe(map(_ => this._mapEvaTipo2(_)))
    );
  }

  private _mapEvaTipo1(_: any[]): DataForEvaT1 {
    const puntos: PuntoEvaluacionT1[] = [];
    let i = 1;

    const grupos: EvaluacionDataT1Response[] = orderBy(_[0], 'orden', 'asc');

    grupos.forEach(grupo => {
      const valCon = null;
      const obs = null;

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
          inspeccionVisual: gaea(i as any, 'av'),
          revisionDocumental: gaea(i as any, 'rd'),
          entrevistaActores: gaea(i as any, 'era'),
          valoracionCondicion: valCon,
          observaciones: obs,
        });

        i++;
      });
    });

    const data = { puntos: orderBy(puntos, 'orden', 'asc'), puntosLibres: [] };

    console.log(data);

    return data;
  }

  private _mapEvaTipo2(_: any[]): DataForEvaT2 {
    const puntos: PuntoEvaluacionT2[] = [];
    let i = 1;

    const grupos: EvaluacionDataT1Response[] = orderBy(_[0], 'orden', 'asc');

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

    return { puntos: orderBy(puntos, 'orden', 'asc'), puntosLibres: _[1] };
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
