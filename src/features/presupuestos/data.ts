import "server-only";
import { crearClienteServidor } from "@/lib/supabase/server";
import type { Presupuesto } from "@/features/presupuestos/types";

/** Lista los presupuestos del usuario autenticado. */
export async function listarPresupuestos(): Promise<Presupuesto[]> {
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`No se pudieron cargar los presupuestos: ${error.message}`);
  }

  return (data ?? []).map((fila) => ({
    id: fila.id,
    categoria: fila.categoria,
    monto: fila.monto,
  }));
}
