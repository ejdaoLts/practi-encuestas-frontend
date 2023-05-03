import { UsuarioResponse } from './usuario.response';

export interface EntidadResponse {
  id: number;
  representante_id: number;
  tipo_documento: number;
  numero_documento: string;
  tipo: number;
  nombre: string;
  representante?: UsuarioResponse;
}
