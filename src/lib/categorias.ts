/**
 * Categorías predefinidas de transacciones.
 *
 * Cada categoría tiene un color asociado de la paleta de gráficos
 * (`--chart-1` … `--chart-8`) para mantener coherencia visual entre
 * badges, listados y el gráfico del dashboard.
 */

export type TipoTransaccion = "ingreso" | "gasto";

/** Indica en qué tipo(s) de transacción aplica la categoría. */
export type AplicaEn = TipoTransaccion | "ambos";

export interface Categoria {
  /** Identificador estable usado en base de datos y filtros. */
  id: string;
  /** Nombre visible en la UI (en español). */
  nombre: string;
  /** Variable CSS de color de la paleta de gráficos. */
  color: string;
  /** Tipo de transacción en el que se ofrece la categoría. */
  aplicaEn: AplicaEn;
}

export const CATEGORIAS: readonly Categoria[] = [
  {
    id: "alimentacion",
    nombre: "Alimentación",
    color: "var(--chart-5)",
    aplicaEn: "gasto",
  },
  {
    id: "transporte",
    nombre: "Transporte",
    color: "var(--chart-2)",
    aplicaEn: "gasto",
  },
  {
    id: "vivienda",
    nombre: "Vivienda",
    color: "var(--chart-1)",
    aplicaEn: "gasto",
  },
  { id: "ocio", nombre: "Ocio", color: "var(--chart-8)", aplicaEn: "gasto" },
  { id: "salud", nombre: "Salud", color: "var(--chart-7)", aplicaEn: "gasto" },
  {
    id: "educacion",
    nombre: "Educación",
    color: "var(--chart-3)",
    aplicaEn: "gasto",
  },
  {
    id: "salario",
    nombre: "Salario",
    color: "var(--chart-4)",
    aplicaEn: "ingreso",
  },
  {
    id: "freelance",
    nombre: "Freelance",
    color: "var(--chart-6)",
    aplicaEn: "ingreso",
  },
  {
    id: "otros",
    nombre: "Otros",
    color: "var(--muted-foreground)",
    aplicaEn: "ambos",
  },
] as const;

/** Mapa id → categoría para búsquedas O(1). */
export const CATEGORIAS_POR_ID: Record<string, Categoria> = Object.fromEntries(
  CATEGORIAS.map((categoria) => [categoria.id, categoria]),
);

/** Devuelve la categoría por id, o la categoría "Otros" como respaldo. */
export function obtenerCategoria(id: string): Categoria {
  return CATEGORIAS_POR_ID[id] ?? CATEGORIAS_POR_ID.otros;
}

/** Categorías disponibles para un tipo de transacción. */
export function categoriasPorTipo(tipo: TipoTransaccion): Categoria[] {
  return CATEGORIAS.filter(
    (categoria) =>
      categoria.aplicaEn === tipo || categoria.aplicaEn === "ambos",
  );
}
