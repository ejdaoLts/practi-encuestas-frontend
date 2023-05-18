export interface CreateEvaluacionPayload {
  entidad_id?: number;
  tipo_id: number;
  periodo_academico: number;
  programa_academico_nom: string;
  estudiantes_acargo?: string;
  maestro_id?: number;
  rotacion?: string;
}
