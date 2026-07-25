import "server-only";
import { crearClienteServidor } from "@/lib/supabase/server";
import { rangoMes, esMesValido } from "@/lib/fechas";
import type { Transaccion } from "@/types/transaccion";

export interface FiltrosTransacciones {
  /** Mes en formato "YYYY-MM". */
  mes?: string;
  /** Id de categoría. */
  categoria?: string;
  /** Texto de búsqueda por descripción. */
  q?: string;
}

/**
 * Lista las transacciones del usuario autenticado aplicando los filtros.
 * La RLS garantiza que solo se devuelvan filas propias.
 */
export async function listarTransacciones(
  filtros: FiltrosTransacciones = {},
): Promise<Transaccion[]> {
  const supabase = await crearClienteServidor();

  let consulta = supabase
    .from("transactions")
    .select("*")
    .order("fecha", { ascending: false })
    .order("created_at", { ascending: false });

  if (filtros.mes && esMesValido(filtros.mes)) {
    const { inicio, fin } = rangoMes(filtros.mes);
    consulta = consulta.gte("fecha", inicio).lte("fecha", fin);
  }

  if (filtros.categoria) {
    consulta = consulta.eq("categoria", filtros.categoria);
  }

  if (filtros.q) {
    consulta = consulta.ilike("descripcion", `%${filtros.q}%`);
  }

  const { data, error } = await consulta;

  if (error) {
    throw new Error(
      `No se pudieron cargar las transacciones: ${error.message}`,
    );
  }

  return data ?? [];
}
