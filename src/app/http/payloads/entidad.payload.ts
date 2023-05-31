export interface CreateEntidadPayload {
  tipo_documento: number;
  numero_documento: string;
  tipo_id: number;
  nombre_completo: string;
  telefono: string;
  entidad_id?: number;
  entidad_nombre_completo?: string;
}
