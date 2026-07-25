/** Utilidades de formato para moneda y fechas, en español. */

// Moneda y locale configurables por entorno (con valores por defecto para
// Colombia). Cambia estas variables en `.env.local` según tu país.
const LOCALE = process.env.NEXT_PUBLIC_LOCALE ?? "es-CO";
const MONEDA = process.env.NEXT_PUBLIC_MONEDA ?? "COP";

const formateadorMoneda = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: MONEDA,
  maximumFractionDigits: 0,
});

/** Formatea un valor numérico como moneda (ej. "$ 1.250.000"). */
export function formatearMoneda(valor: number): string {
  return formateadorMoneda.format(valor);
}

const formateadorFecha = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** Formatea una fecha ISO (YYYY-MM-DD) o Date como "24 jul 2026". */
export function formatearFecha(fecha: string | Date): string {
  const valor =
    typeof fecha === "string" ? new Date(`${fecha}T00:00:00`) : fecha;
  return formateadorFecha.format(valor);
}

const formateadorPorcentaje = new Intl.NumberFormat(LOCALE, {
  style: "percent",
  maximumFractionDigits: 0,
});

/** Formatea una fracción (0–1) como porcentaje (ej. "35 %"). */
export function formatearPorcentaje(fraccion: number): string {
  return formateadorPorcentaje.format(fraccion);
}
