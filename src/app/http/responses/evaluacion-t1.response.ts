export interface EvaluacionDataT1Response {
  id: number;
  orden: number;
  eva_id: number;
  descripcion: string;
  aspectos_evaluacion: AspectoEvaluacionT1Response[];
}

export interface AspectoEvaluacionT1Response {
  id: number;
  orden: number;
  cond_id: number;
  nombre: string;
  documental: string;
}
