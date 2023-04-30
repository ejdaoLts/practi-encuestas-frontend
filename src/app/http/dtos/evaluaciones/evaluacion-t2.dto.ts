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
