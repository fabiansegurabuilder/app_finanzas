"use server";

import { revalidatePath } from "next/cache";
import { crearClienteServidor } from "@/lib/supabase/server";
import {
  metaSchema,
  aporteSchema,
  type EstadoMeta,
} from "@/features/metas/schemas";

function revalidar() {
  revalidatePath("/metas");
  revalidatePath("/dashboard");
}

/** Crea una meta de ahorro para el usuario autenticado. */
export async function crearMeta(
  _prevState: EstadoMeta,
  formData: FormData,
): Promise<EstadoMeta> {
  const parseo = metaSchema.safeParse({
    nombre: formData.get("nombre"),
    montoObjetivo: formData.get("montoObjetivo"),
    fechaLimite: formData.get("fechaLimite"),
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

  const { error } = await supabase.from("goals").insert({
    nombre: parseo.data.nombre,
    monto_objetivo: parseo.data.montoObjetivo,
    fecha_limite: parseo.data.fechaLimite || null,
    user_id: user.id,
  });

  if (error) {
    return { error: "No se pudo crear la meta." };
  }

  revalidar();
  return { ok: true };
}

/** Registra un aporte o retiro sobre una meta. */
export async function registrarAporte(
  id: string,
  _prevState: EstadoMeta,
  formData: FormData,
): Promise<EstadoMeta> {
  const parseo = aporteSchema.safeParse({
    monto: formData.get("monto"),
    tipo: formData.get("tipo"),
  });
  if (!parseo.success) {
    return { error: parseo.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await crearClienteServidor();
  const { data: meta, error: errorLectura } = await supabase
    .from("goals")
    .select("monto_actual")
    .eq("id", id)
    .single();

  if (errorLectura || !meta) {
    return { error: "No se encontró la meta." };
  }

  const delta =
    parseo.data.tipo === "retiro" ? -parseo.data.monto : parseo.data.monto;
  const nuevoMonto = Math.max(0, meta.monto_actual + delta);

  const { error } = await supabase
    .from("goals")
    .update({ monto_actual: nuevoMonto })
    .eq("id", id);

  if (error) {
    return { error: "No se pudo registrar el movimiento." };
  }

  revalidar();
  return { ok: true };
}

/** Elimina una meta (propiedad garantizada por RLS). */
export async function eliminarMeta(id: string): Promise<EstadoMeta> {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from("goals").delete().eq("id", id);

  if (error) {
    return { error: "No se pudo eliminar la meta." };
  }

  revalidar();
  return { ok: true };
}
