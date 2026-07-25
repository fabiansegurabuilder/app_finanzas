/** Utilidades de formato para moneda y fechas, en español. */

const formateadorMoneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/** Formatea un valor numérico como moneda (ej. "$ 1.250.000"). */
export function formatearMoneda(valor: number): string {
  return formateadorMoneda.format(valor);
}

const formateadorFecha = new Intl.DateTimeFormat("es-CO", {
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
