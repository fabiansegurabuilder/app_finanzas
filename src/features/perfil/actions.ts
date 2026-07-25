"use server";

import { revalidatePath } from "next/cache";
import { crearClienteServidor } from "@/lib/supabase/server";
import {
  perfilSchema,
  passwordSchema,
  type EstadoPerfil,
} from "@/features/perfil/schemas";

/** Actualiza el nombre visible del usuario (user_metadata.full_name). */
export async function actualizarPerfil(
  _prevState: EstadoPerfil,
  formData: FormData,
): Promise<EstadoPerfil> {
  const parseo = perfilSchema.safeParse({ nombre: formData.get("nombre") });
  if (!parseo.success) {
    return { error: parseo.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await crearClienteServidor();
  const { error } = await supabase.auth.updateUser({
    data: { full_name: parseo.data.nombre },
  });

  if (error) {
    return { error: "No se pudo actualizar tu perfil." };
  }

  revalidatePath("/", "layout");
  return { ok: true, mensaje: "Perfil actualizado." };
}

/** Cambia la contraseña del usuario autenticado. */
export async function cambiarPassword(
  _prevState: EstadoPerfil,
  formData: FormData,
): Promise<EstadoPerfil> {
  const parseo = passwordSchema.safeParse({
    password: formData.get("password"),
    confirmar: formData.get("confirmar"),
  });
  if (!parseo.success) {
    return { error: parseo.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await crearClienteServidor();
  const { error } = await supabase.auth.updateUser({
    password: parseo.data.password,
  });

  if (error) {
    return { error: "No se pudo cambiar la contraseña." };
  }

  return { ok: true, mensaje: "Contraseña actualizada." };
}
