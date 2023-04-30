export interface PuntoEvaluacionT1Payload {
  eva_id: number;
  cond_id: number;
  aspva_id: number;
  tv_visual: boolean;
  tv_documental: boolean;
  tv_entrevista: boolean;
  val_cond: number;
  observacion: string | null;
}
