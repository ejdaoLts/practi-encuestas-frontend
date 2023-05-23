export interface EvaluacionPendienteDto {
  nombreTipoEvaluacion: string;
  nombreEntidad: string;
  id: number;
  tipo_id: number;
  entidad_id: number;
  created_at: Date;
  usuario_id: number;
  last_update: Date | null;
  maestro: {
    created_at: Date;
    created_by: number;
    entidad_id: number;
    id: number;
    nombre_completo: string;
    numero_documento: string;
    representante_id: number | null;
    telefono: string;
    tipo: { id: number; nombre: string };
    tipo_documento: number;
    tipo_id: number;
    updated_at: Date | null;
    updated_by: Date | null;
  };
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
    tipo_id: number;
    tipo: {
      id: number;
      nombre: string;
    };
    nombre_completo: string;
  };
}
