import { GcmGrouped, cloneDeep, groupByKey, uniq } from '@eklipse/utilities';
import { ICalCondicion, IEvaCalT1, IResultado } from './evaluaciones.interfaces';

export const generarGraficas = (data: IEvaCalT1[]) => {
  const resultados: { entidad: string; resultados: GcmGrouped<IResultado>[] }[] = [];
  const aspectos: string[] = [];
  const datasetsGrouped: any[] = [];
  const aspectosEvaluados: { key: number; condicion: string; description: string }[] = [];

  data.forEach(_ => {
    const grouped = groupByKey(_.resultados, 'condicion');
    resultados.push({ entidad: _.entidad.nombre_completo, resultados: grouped });
  });

  resultados[0].resultados.forEach(_ => {
    aspectos.push(_.key);
  });

  aspectos.forEach(aspecto => {
    const data: any[] = [];

    resultados.forEach(resultado => {
      resultado.resultados.forEach(res => {
        if (res.key === aspecto) data.push({ entidad: resultado.entidad, aspectos: res.rows });
      });
    });

    const datasets: any[] = [];
    let labels: any[] = [];

    data.forEach((_, i) => {
      if (!i) {
        _.aspectos.forEach((asp: any) => {
          aspectosEvaluados.push({
            key: asp.orden,
            condicion: asp.condicion,
            description: asp.aspecto_evaluar,
          });
        });
      }
      labels = [..._.aspectos.map((_2: any) => _2.orden), 'TOTAL'];
      const calificaciones = _.aspectos.map((_2: any) => _2.calificacion);
      let suma = 0;
      calificaciones.forEach((_: number) => {
        suma += _;
      });
      datasets.push({
        label: _.entidad,
        data: [...calificaciones, suma / calificaciones.length],
      });
    });

    datasetsGrouped.push({
      labels,
      datasets,
      aspecto,
    });
  });

  return { datasetsGrouped, aspectosEvaluados };
};
export const generarGraficasCondiciones = (data: IEvaCalT1[]) => {
  const labels = uniq(cloneDeep(data[0]).resultados.map(_ => _.condicion));
  labels.push('TOTAL');
  const datasets: any[] = [];

  data.forEach(res => {
    const arrNum: number[] = [];

    labels.forEach(label => {
      if (label !== 'TOTAL') {
        const dt = res.resultadosCondiciones.filter(rc => rc.nombre === label)[0];
        arrNum.push(dt.calificacion);
      }
    });

    arrNum.push(res.calificacionFinal);

    datasets.push({ label: res.nombreEvaluado, data: arrNum });
  });

  const result = {
    labels,
    datasets,
  };

  return result;
};

export const generarGraficasGeneral = (data: IEvaCalT1[]) => {
  const labels = ['CALIFICACIÓN TOTAL'];
  const datasets: any[] = [];

  data.forEach(res => {
    datasets.push({ label: res.nombreEvaluado, data: [res.calificacionFinal] });
  });

  const result = {
    labels,
    datasets,
  };

  console.log(result);

  return result;
};

export const calcularCalificacionCondicion = (rows: IResultado[]) => {
  let exp = 0,
    total = 0;

  rows.forEach(_ => {
    if (_.calificacion) {
      exp++;
      total += _.calificacion;
    }
  });

  return +(total / exp).toFixed(2);
};
