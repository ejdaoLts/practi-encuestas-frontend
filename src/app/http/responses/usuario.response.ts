export interface UsuarioResponse {
  id: number;
  tipo_documento: number | null;
  numero_documento: number | null;
  rol_id: number;
  nombre_completo: string;
  email: string;
  username: number | null;
  is_active: number;
}
