export interface IEvaCalT2 {
  tipoEval: string;
  nombreEvaluador: string;
  nombreEvaluado: string;
  id: number;
  tipo_id: number;
  periodo_academico: number;
  programa_academico: number;
  estudiantes_acargo: number | null;
  rotacion: number;
  entidad_id: number;
  created_at: Date;
  usuario_id: number;
  maestro_id: number;
  last_update: Date;
  finished: boolean;
  resultados: {
    orden: number;
    condicion: string;
    aspecto_evaluar: string;
    calificacion: number;
  }[];
  preguntasLibres: { pta: string; rta: string }[];
  tipo_evaluacion: {
    id: number;
    tipo: number;
    nombre: string;
    descripcion: string;
  };
  usuario: {
    id: number;
    tipo_documento: number | null;
    numero_documento: string | null;
    numero_telefono: string | null;
    rol_id: number;
    nombre_completo: string;
    email: string;
    username: string | null;
    is_active: number;
  };
  entidad: {
    id: number;
    representante_id: number | null;
    tipo_documento: number;
    numero_documento: string;
    tipo_id: number;
    nombre_completo: string;
    telefono: string;
    entidad_id: number;
    created_at: Date;
    created_by: number;
    updated_at: Date;
    updated_by: Date;
    tipo: {
      id: number;
      nombre: string;
    };
  };
  maestro?: {
    id: number;
    representante_id: number | null;
    tipo_documento: number;
    numero_documento: string;
    tipo_id: number;
    nombre_completo: string;
    telefono: string;
    entidad_id: number;
    created_at: Date;
    created_by: number;
    updated_at: Date;
    updated_by: Date;
    tipo: {
      id: number;
      nombre: string;
    };
  };
}
