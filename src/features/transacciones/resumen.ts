import type { Transaccion } from "@/types/transaccion";
import { obtenerCategoria } from "@/lib/categorias";

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
): GastoCategoria[] {
  const totales = new Map<string, number>();

  for (const t of transacciones) {
    if (t.tipo !== "gasto") continue;
    totales.set(t.categoria, (totales.get(t.categoria) ?? 0) + t.valor);
  }

  return Array.from(totales.entries())
    .map(([categoriaId, total]) => {
      const categoria = obtenerCategoria(categoriaId);
      return {
        categoriaId,
        nombre: categoria.nombre,
        color: categoria.color,
        total,
      };
    })
    .sort((a, b) => b.total - a.total);
}
