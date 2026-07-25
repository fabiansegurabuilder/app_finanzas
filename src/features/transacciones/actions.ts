"use server";

import { revalidatePath } from "next/cache";
import { crearClienteServidor } from "@/lib/supabase/server";
import {
  transaccionSchema,
  type EstadoTransaccion,
} from "@/features/transacciones/schemas";

/** Extrae y valida los datos del formulario de transacción. */
function leerFormulario(formData: FormData) {
  return transaccionSchema.safeParse({
    descripcion: formData.get("descripcion"),
    valor: formData.get("valor"),
    tipo: formData.get("tipo"),
    categoria: formData.get("categoria"),
    fecha: formData.get("fecha"),
  });
}

/** Revalida las vistas afectadas por un cambio en transacciones. */
function revalidarVistas() {
  revalidatePath("/dashboard");
  revalidatePath("/transacciones");
}

/** Crea una transacción para el usuario autenticado. */
export async function crearTransaccion(
  _prevState: EstadoTransaccion,
  formData: FormData,
): Promise<EstadoTransaccion> {
  const parseo = leerFormulario(formData);
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
    .from("transactions")
    .insert({ ...parseo.data, user_id: user.id });

  if (error) {
    return { error: "No se pudo guardar la transacción." };
  }

  revalidarVistas();
  return { ok: true };
}

/** Actualiza una transacción existente (propiedad garantizada por RLS). */
export async function actualizarTransaccion(
  id: string,
  _prevState: EstadoTransaccion,
  formData: FormData,
): Promise<EstadoTransaccion> {
  const parseo = leerFormulario(formData);
  if (!parseo.success) {
    return { error: parseo.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await crearClienteServidor();
  const { error } = await supabase
    .from("transactions")
    .update(parseo.data)
    .eq("id", id);

  if (error) {
    return { error: "No se pudo actualizar la transacción." };
  }

  revalidarVistas();
  return { ok: true };
}

/** Elimina una transacción (propiedad garantizada por RLS). */
export async function eliminarTransaccion(
  id: string,
): Promise<EstadoTransaccion> {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    return { error: "No se pudo eliminar la transacción." };
  }

  revalidarVistas();
  return { ok: true };
}
