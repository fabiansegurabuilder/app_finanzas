"use server";

import { revalidatePath } from "next/cache";
import { crearClienteServidor } from "@/lib/supabase/server";
import {
  categoriaSchema,
  type EstadoCategoria,
} from "@/features/categorias/schemas";

function revalidar() {
  revalidatePath("/categorias");
  revalidatePath("/transacciones");
  revalidatePath("/dashboard");
}

/** Crea una categoría personalizada para el usuario autenticado. */
export async function crearCategoria(
  _prevState: EstadoCategoria,
  formData: FormData,
): Promise<EstadoCategoria> {
  const parseo = categoriaSchema.safeParse({
    nombre: formData.get("nombre"),
    tipo: formData.get("tipo"),
    color: formData.get("color"),
  });
  if (!parseo.success) {
    return { error: parseo.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Tu sesión expiró. Inicia sesión nuevamente." };
  }

  const { error } = await supabase
    .from("categories")
    .insert({ ...parseo.data, user_id: user.id });

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya tienes una categoría con ese nombre." };
    }
    return { error: "No se pudo crear la categoría." };
  }

  revalidar();
  return { ok: true };
}

/** Elimina una categoría personalizada (propiedad garantizada por RLS). */
export async function eliminarCategoria(id: string): Promise<EstadoCategoria> {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { error: "No se pudo eliminar la categoría." };
  }

  revalidar();
  return { ok: true };
}
