export interface IEvaCalT1 {
  id: number;
  created_at: string;
  last_update: string;
  nombreEvaluador: string;
  nombreEvaluado: string;
  resultados: IResultado[];
  resultadosCondiciones: { nombre: string; calificacion: number }[];
  calificacionFinal: number;
  tipo_evaluacion: {
    id: number;
    tipo: number;
    nombre: string;
    descripcion: string;
  };
  usuario: {
    id: number;
    tipo_documento: string | null;
    numero_documento: string | null;
    numero_telefono: string | null;
    rol_id: number;
    nombre_completo: string;
    email: string;
    username: string | null;
    is_active: number;
  };
  entidad: IEntidad;
}

export interface ICalCondicion {
  nombre: string;
  calificacion: number;
}

export interface IEntidad {
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
  entidad?: IEntidad;
}

export interface IResultado {
  tv_visual: number;
  tv_documental: number;
  tv_entrevista: number;
  val_cond: number;
  calificacion: number;
  observacion: null;
  orden: number;
  condicion: string;
  aspecto_evaluar: string;
}
