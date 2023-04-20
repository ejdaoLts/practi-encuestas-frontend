import { ValoracionesEvaluacion } from '@http/constants';

export interface PuntoEvaluacionT1 {
  id: number;
  orden: number;
  nombre: string;
  documental: string;
  grupo: {
    id: number;
    orden: number;
    descripcion: string;
  };
  inspeccionVisual: boolean;
  revisionDocumental: boolean;
  entrevistaActores: boolean;
  valoracionCondicion: ValoracionesEvaluacion | null;
  observaciones: string;
}
