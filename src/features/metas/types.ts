/** Meta de ahorro tal como la usa la UI. */
export interface Meta {
  id: string;
  nombre: string;
  montoObjetivo: number;
  montoActual: number;
  fechaLimite: string | null;
}
