import "server-only";
import { crearClienteServidor } from "@/lib/supabase/server";
import type { Recurrente } from "@/features/recurrentes/types";

/** Lista las transacciones recurrentes del usuario autenticado. */
export async function listarRecurrentes(): Promise<Recurrente[]> {
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("recurring_transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar las recurrentes: ${error.message}`);
  }

  return (data ?? []).map((fila) => ({
    id: fila.id,
    descripcion: fila.descripcion,
    valor: fila.valor,
    tipo: fila.tipo,
    categoria: fila.categoria,
    frecuencia: fila.frecuencia,
    proximaFecha: fila.proxima_fecha,
    activa: fila.activa,
  }));
}
