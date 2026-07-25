import { addDays, addWeeks, addMonths, format, parseISO } from "date-fns";
import type { Frecuencia, Recurrente } from "@/features/recurrentes/types";

/** Avanza una fecha ISO según la frecuencia. */
export function avanzarFecha(fecha: string, frecuencia: Frecuencia): string {
  const base = parseISO(fecha);
  const siguiente =
    frecuencia === "semanal"
      ? addWeeks(base, 1)
      : frecuencia === "quincenal"
        ? addDays(base, 15)
        : addMonths(base, 1);
  return format(siguiente, "yyyy-MM-dd");
}

/**
 * Fechas pendientes de generar (desde `proximaFecha` hasta `hoy`, inclusive).
 * El límite evita bucles si la fecha inicial es muy antigua.
 */
export function ocurrenciasPendientes(
  proximaFecha: string,
  frecuencia: Frecuencia,
  hoy: string,
  limite = 500,
): string[] {
  const fechas: string[] = [];
  let fecha = proximaFecha;
  while (fecha <= hoy && fechas.length < limite) {
    fechas.push(fecha);
    fecha = avanzarFecha(fecha, frecuencia);
  }
  return fechas;
}

/** Cuenta cuántas ocurrencias se generarían para las recurrentes activas. */
export function contarPendientes(
  recurrentes: readonly Recurrente[],
  hoy: string,
): number {
  return recurrentes
    .filter((r) => r.activa)
    .reduce(
      (suma, r) =>
        suma + ocurrenciasPendientes(r.proximaFecha, r.frecuencia, hoy).length,
      0,
    );
}

export const ETIQUETA_FRECUENCIA: Record<Frecuencia, string> = {
  semanal: "Semanal",
  quincenal: "Quincenal",
  mensual: "Mensual",
};
