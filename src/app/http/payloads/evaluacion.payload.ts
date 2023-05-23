export interface CreateEvaluacionPayload {
  entidad_id?: number;
  tipo_id: number;
  periodo_academico: number;
  estudiantes_acargo?: string;
  maestro_id?: number;
  rotacion?: string;
}
