import { GcmGrouped, groupByKey } from '@eklipse/utilities';
import { IEvaCalT1, IResultado } from './evaluaciones.interfaces';

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
