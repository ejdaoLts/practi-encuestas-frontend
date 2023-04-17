export interface EvaluacionPendienteDto {
  id: number;
  tipo_id: number;
  entidad_id: number;
  created_at: Date;
  usuario_id: number;
  last_update: Date | null;
  finished: number;
  tipo_evaluacion: {
    id: number;
    tipo: number;
    nombre: string;
    descripcion: string;
  };
  usuario: {
    id: number;
    tipo_documento: number;
    numero_documento: string;
    rol_id: number;
    nombre_completo: string;
    email: string;
    username: string | null;
    is_active: boolean;
  };
  entidad: {
    id: number;
    representante_id: number;
    tipo_documento: number;
    numero_documento: string;
    tipo: number;
    nombre: string;
  };
}
