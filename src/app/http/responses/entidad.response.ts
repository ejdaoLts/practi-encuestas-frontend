import { UsuarioResponse } from './usuario.response';

export interface EntidadResponse {
  id: number;
  representante_id: number;
  entidad_id?: number;
  entidad?: EntidadResponse;
  tipo_documento: number;
  numero_documento: string;
  tipo: { id: number; nombre: string };
  nombre_completo: string;
  representante?: UsuarioResponse;
  telefono: string;
  fecha_ultima_evaluacion: string | null;
  min_time_last_eva_valid: boolean;
  nombre_tipo_entidad: string;
}
