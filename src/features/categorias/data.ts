import "server-only";
import { crearClienteServidor } from "@/lib/supabase/server";
import type { Categoria } from "@/lib/categorias";

/** Lista las categorías personalizadas del usuario autenticado. */
export async function listarCategoriasUsuario(): Promise<Categoria[]> {
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(`No se pudieron cargar las categorías: ${error.message}`);
  }

  return (data ?? []).map((fila) => ({
    id: fila.id,
    nombre: fila.nombre,
    color: fila.color,
    aplicaEn: fila.tipo,
  }));
}
