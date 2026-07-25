import "server-only";
import { crearClienteServidor } from "@/lib/supabase/server";
import type { Meta } from "@/features/metas/types";

/** Lista las metas de ahorro del usuario autenticado. */
export async function listarMetas(): Promise<Meta[]> {
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar las metas: ${error.message}`);
  }

  return (data ?? []).map((fila) => ({
    id: fila.id,
    nombre: fila.nombre,
    montoObjetivo: fila.monto_objetivo,
    montoActual: fila.monto_actual,
    fechaLimite: fila.fecha_limite,
  }));
}

/** Suma total ahorrado en todas las metas. */
export function totalAhorrado(metas: readonly Meta[]): number {
  return metas.reduce((suma, m) => suma + m.montoActual, 0);
}
