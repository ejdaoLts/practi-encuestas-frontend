import { GcmGrouped, cloneDeep, groupByKey, uniq } from '@eklipse/utilities';
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

    const dataForMiniTable: any[] = [];
    const labelsForMiniTable: any[] = ['CENTRO'];

    datasets.forEach(dataset => {
      const newEnt: any = {
        CENTRO: dataset.label,
      };

      dataset.data.forEach((el: number, i: number) => {
        if (i + 1 < dataset.data.length) {
          labelsForMiniTable.push(`P${labels[i]}`);
          newEnt[`P${labels[i]}`] = el;
        } else {
          labelsForMiniTable.push(`TOTAL`);
          newEnt[`TOTAL`] = el;
        }
      });

      dataForMiniTable.push(newEnt);
    });

    datasetsGrouped.push({
      labels,
      datasets,
      dataForMiniTable,
      labelsForMiniTable: uniq(labelsForMiniTable),
      aspecto,
    });
  });

  return { datasetsGrouped, aspectosEvaluados };
};
export const generarGraficasCondiciones = (data: IEvaCalT1[]) => {
  const labelsNames: any[] = [];
  const labels = uniq(cloneDeep(data[0]).resultados.map(_ => _.condicion));

  const labelsEnumered: string[] = [];

  labels.forEach((_, i) => {
    labelsEnumered.push(`C${i + 1}`);
  });

  labels.forEach((label, i) => {
    labelsNames.push({ value: `C${i + 1}`, name: label });
  });

  labels.push('TOTAL');
  labelsEnumered.push('TOTAL');
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

  const dataForMiniTable: any[] = [];

  datasets.forEach(dataset => {
    const newEnt: any = {
      nombre: dataset.label,
    };

    dataset.data.forEach((el: number, i: number) => {
      if (i + 1 < dataset.data.length) newEnt[`C${i + 1}`] = el;
      else newEnt[`TOTAL`] = el;
    });

    dataForMiniTable.push(newEnt);
  });

  const result = {
    labels: labelsEnumered,
    dataForMiniTable,
    labelsNames,
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

  const dataForMiniTable: any[] = [];

  datasets.forEach(dataset => {
    const newEnt: any = {
      nombre: dataset.label,
      calificacion: 0,
    };

    dataset.data.forEach((el: number, i: number) => {
      newEnt.calificacion = el;
    });

    dataForMiniTable.push(newEnt);
  });

  const result = {
    labels,
    datasets,
    dataForMiniTable,
  };

  return result;
};

export const generarGraficasGeneralPorCondicion = (data: IEvaCalT1[]) => {
  const tempData = [
    { nombre: 'ASPECTOS GENERALES', calificacion: 0 },
    { nombre: 'CAPACIDAD INSTALADA', calificacion: 0 },
    { nombre: 'SEGURIDAD, PROTECCIÓN Y BIENESTAR', calificacion: 0 },
    { nombre: 'ORGANIZACIÓN ADMINISTRATIVA PARA LA DOCENCIA SERVICIO', calificacion: 0 },
    { nombre: 'PERSONAL DOCENTE', calificacion: 0 },
    { nombre: 'PRÁCTICAS FORMATIVAS', calificacion: 0 },
    { nombre: 'CULTURA DEL MEJORAMIENTO CONTINUO', calificacion: 0 },
  ];

  data.forEach(el => {
    el.resultadosCondiciones.forEach(rc => {
      tempData.filter(td => td.nombre === rc.nombre)[0].calificacion += rc.calificacion;
    });
  });

  tempData.map(el => {
    el.calificacion = el.calificacion / data.length;
  });

  const labels = ['CALIFICACIÓN GENERAL POR CODICIÓN'];
  const datasets: any[] = [];

  tempData.forEach(res => {
    datasets.push({ label: res.nombre, data: [res.calificacion] });
  });

  const dataForMiniTable: any[] = [];

  datasets.forEach(dataset => {
    const newEnt: any = {
      nombre: dataset.label,
      calificacion: 0,
    };

    dataset.data.forEach((el: number, i: number) => {
      newEnt.calificacion = el;
    });

    dataForMiniTable.push(newEnt);
  });

  const result = {
    labels,
    datasets,
    dataForMiniTable,
  };

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
