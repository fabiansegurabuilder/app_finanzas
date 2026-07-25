export type Frecuencia = "semanal" | "quincenal" | "mensual";

/** Transacción recurrente tal como la usa la UI. */
export interface Recurrente {
  id: string;
  descripcion: string;
  valor: number;
  tipo: "ingreso" | "gasto";
  categoria: string;
  frecuencia: Frecuencia;
  proximaFecha: string;
  activa: boolean;
}
