import { format, parse, endOfMonth, subMonths } from "date-fns";
import { es } from "date-fns/locale";

/** Devuelve el mes actual en formato "YYYY-MM". */
export function mesActual(): string {
  return format(new Date(), "yyyy-MM");
}

/** Valida que una cadena tenga el formato "YYYY-MM". */
export function esMesValido(mes: string): boolean {
  return /^\d{4}-\d{2}$/.test(mes);
}

/** Rango de fechas (ISO) que cubre un mes "YYYY-MM". */
export function rangoMes(mes: string): { inicio: string; fin: string } {
  const base = parse(mes, "yyyy-MM", new Date());
  return {
    inicio: format(base, "yyyy-MM-01"),
    fin: format(endOfMonth(base), "yyyy-MM-dd"),
  };
}

/** Etiqueta legible de un mes, ej. "julio de 2026". */
export function etiquetaMes(mes: string): string {
  const base = parse(mes, "yyyy-MM", new Date());
  return format(base, "MMMM 'de' yyyy", { locale: es });
}

/** Lista los últimos `cantidad` meses (del más reciente al más antiguo). */
export function mesesRecientes(
  cantidad = 12,
): { valor: string; etiqueta: string }[] {
  const hoy = new Date();
  return Array.from({ length: cantidad }, (_, i) => {
    const fecha = subMonths(hoy, i);
    const valor = format(fecha, "yyyy-MM");
    return { valor, etiqueta: etiquetaMes(valor) };
  });
}

/** Fecha de hoy en formato "YYYY-MM-DD" (para valores por defecto). */
export function hoyISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}
