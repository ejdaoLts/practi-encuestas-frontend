import { ValoracionesEvaluacionT1 } from '@http/constants';

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
  valoracionCondicion: ValoracionesEvaluacionT1 | null;
  observaciones: string | null;
}
