import type { Transaccion } from "@/types/transaccion";
import {
  obtenerCategoria,
  resolverCategoria,
  type Catalogo,
} from "@/lib/categorias";

const CABECERAS = ["Fecha", "Descripción", "Categoría", "Tipo", "Valor"];

/** Escapa un campo para CSV (comillas y separadores). */
function escapar(campo: string): string {
  if (/[",\n]/.test(campo)) {
    return `"${campo.replace(/"/g, '""')}"`;
  }
  return campo;
}

/** Genera el contenido CSV de un conjunto de transacciones. */
export function generarCSV(
  transacciones: readonly Transaccion[],
  catalogo?: Catalogo,
): string {
  const filas = transacciones.map((t) => {
    const categoria = catalogo
      ? resolverCategoria(catalogo, t.categoria).nombre
      : obtenerCategoria(t.categoria).nombre;
    const tipo = t.tipo === "ingreso" ? "Ingreso" : "Gasto";
    return [t.fecha, t.descripcion, categoria, tipo, String(t.valor)]
      .map(escapar)
      .join(",");
  });

  return [CABECERAS.join(","), ...filas].join("\n");
}

/** Nombre de archivo sugerido para la exportación. */
export function nombreArchivoCSV(mes?: string): string {
  const sufijo = mes ?? "todas";
  return `transacciones-${sufijo}.csv`;
}
