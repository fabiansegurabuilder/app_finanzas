import type { Transaccion } from "@/types/transaccion";
import {
  obtenerCategoria,
  resolverCategoria,
  type Catalogo,
} from "@/lib/categorias";
import { MESES_CORTOS } from "@/lib/fechas";

export interface ResumenFinanciero {
  ingresos: number;
  gastos: number;
  saldo: number;
}

export interface GastoCategoria {
  categoriaId: string;
  nombre: string;
  color: string;
  total: number;
}

/** Calcula ingresos, gastos y saldo de un conjunto de transacciones. */
export function calcularResumen(
  transacciones: readonly Transaccion[],
): ResumenFinanciero {
  const ingresos = transacciones
    .filter((t) => t.tipo === "ingreso")
    .reduce((suma, t) => suma + t.valor, 0);

  const gastos = transacciones
    .filter((t) => t.tipo === "gasto")
    .reduce((suma, t) => suma + t.valor, 0);

  return { ingresos, gastos, saldo: ingresos - gastos };
}

/**
 * Agrupa los gastos por categoría, ordenados de mayor a menor total.
 * Ignora los ingresos.
 */
export function agruparGastosPorCategoria(
  transacciones: readonly Transaccion[],
  catalogo?: Catalogo,
): GastoCategoria[] {
  const totales = new Map<string, number>();

  for (const t of transacciones) {
    if (t.tipo !== "gasto") continue;
    totales.set(t.categoria, (totales.get(t.categoria) ?? 0) + t.valor);
  }

  return Array.from(totales.entries())
    .map(([categoriaId, total]) => {
      const categoria = catalogo
        ? resolverCategoria(catalogo, categoriaId)
        : obtenerCategoria(categoriaId);
      return {
        categoriaId,
        nombre: categoria.nombre,
        color: categoria.color,
        total,
      };
    })
    .sort((a, b) => b.total - a.total);
}

/** Mapa id de categoría → total gastado (solo gastos). */
export function totalesGastoPorCategoria(
  transacciones: readonly Transaccion[],
): Record<string, number> {
  const totales: Record<string, number> = {};
  for (const t of transacciones) {
    if (t.tipo !== "gasto") continue;
    totales[t.categoria] = (totales[t.categoria] ?? 0) + t.valor;
  }
  return totales;
}

export interface ResumenMensual {
  /** Número de mes (1–12). */
  mes: number;
  /** Etiqueta corta (ene, feb, …). */
  etiqueta: string;
  ingresos: number;
  gastos: number;
  saldo: number;
}

/**
 * Agrupa las transacciones de un año en sus 12 meses (rellena con ceros los
 * meses sin movimientos). Útil para el histórico anual.
 */
export function agruparPorMes(
  transacciones: readonly Transaccion[],
): ResumenMensual[] {
  const meses: ResumenMensual[] = MESES_CORTOS.map((etiqueta, i) => ({
    mes: i + 1,
    etiqueta,
    ingresos: 0,
    gastos: 0,
    saldo: 0,
  }));

  for (const t of transacciones) {
    const indice = Number(t.fecha.slice(5, 7)) - 1;
    if (indice < 0 || indice > 11) continue;
    if (t.tipo === "ingreso") meses[indice].ingresos += t.valor;
    else meses[indice].gastos += t.valor;
  }

  for (const m of meses) {
    m.saldo = m.ingresos - m.gastos;
  }

  return meses;
}
