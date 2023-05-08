export interface UsuarioResponse {
  id: number;
  tipo_documento: number | null;
  numero_documento: number | null;
  rol_id: number;
  nombre_completo: string;
  numero_telefono: string;
  email: string;
  username: number | null;
  is_active: number;
}
