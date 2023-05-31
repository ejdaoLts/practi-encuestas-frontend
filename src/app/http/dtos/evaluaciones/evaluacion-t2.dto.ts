export interface PuntoEvaluacionT2 {
  id: number;
  orden: number;
  nombre: string;
  grupo: {
    id: number;
    orden: number;
    descripcion: string;
  };
  gradoAcuerdo: number | null | undefined;
}

export interface PreguntaLibreT2 {
  id: number;
  pregunta: string;
  tipo_eva_id: number;
}

export interface RespuestaLibreT2 {
  eva_id: number;
  preg_libre_id: number;
  respuesta: string;
}

export interface DataForEvaT2 {
  puntos: PuntoEvaluacionT2[];
  puntosLibres: PreguntaLibreT2[];
}
