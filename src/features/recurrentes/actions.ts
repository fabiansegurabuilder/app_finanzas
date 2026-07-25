"use server";

import { revalidatePath } from "next/cache";
import { crearClienteServidor } from "@/lib/supabase/server";
import { hoyISO } from "@/lib/fechas";
import {
  recurrenteSchema,
  type EstadoRecurrente,
} from "@/features/recurrentes/schemas";
import {
  avanzarFecha,
  ocurrenciasPendientes,
} from "@/features/recurrentes/logica";

function revalidar() {
  revalidatePath("/recurrentes");
  revalidatePath("/transacciones");
  revalidatePath("/dashboard");
}

/** Crea una transacción recurrente. */
export async function crearRecurrente(
  _prevState: EstadoRecurrente,
  formData: FormData,
): Promise<EstadoRecurrente> {
  const parseo = recurrenteSchema.safeParse({
    descripcion: formData.get("descripcion"),
    valor: formData.get("valor"),
    tipo: formData.get("tipo"),
    categoria: formData.get("categoria"),
    frecuencia: formData.get("frecuencia"),
    proximaFecha: formData.get("proximaFecha"),
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

  const { error } = await supabase.from("recurring_transactions").insert({
    user_id: user.id,
    descripcion: parseo.data.descripcion,
    valor: parseo.data.valor,
    tipo: parseo.data.tipo,
    categoria: parseo.data.categoria,
    frecuencia: parseo.data.frecuencia,
    proxima_fecha: parseo.data.proximaFecha,
  });

  if (error) {
    return { error: "No se pudo crear la recurrente." };
  }

  revalidar();
  return { ok: true };
}

/** Activa o pausa una recurrente. */
export async function alternarRecurrente(
  id: string,
  activa: boolean,
): Promise<EstadoRecurrente> {
  const supabase = await crearClienteServidor();
  const { error } = await supabase
    .from("recurring_transactions")
    .update({ activa })
    .eq("id", id);

  if (error) {
    return { error: "No se pudo actualizar la recurrente." };
  }

  revalidar();
  return { ok: true };
}

/** Elimina una recurrente (propiedad garantizada por RLS). */
export async function eliminarRecurrente(
  id: string,
): Promise<EstadoRecurrente> {
  const supabase = await crearClienteServidor();
  const { error } = await supabase
    .from("recurring_transactions")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: "No se pudo eliminar la recurrente." };
  }

  revalidar();
  return { ok: true };
}

/**
 * Genera las transacciones pendientes de todas las recurrentes activas y
 * avanza su próxima fecha. Es idempotente: al avanzar la fecha, no duplica.
 */
export async function generarPendientes(): Promise<EstadoRecurrente> {
  const supabase = await crearClienteServidor();
  const hoy = hoyISO();

  const { data: recs, error: errorLectura } = await supabase
    .from("recurring_transactions")
    .select("*")
    .eq("activa", true)
    .lte("proxima_fecha", hoy);

  if (errorLectura) {
    return { error: "No se pudieron revisar las recurrentes." };
  }

  let generadas = 0;
  for (const r of recs ?? []) {
    const fechas = ocurrenciasPendientes(r.proxima_fecha, r.frecuencia, hoy);
    if (fechas.length === 0) continue;

    const inserts = fechas.map((fecha) => ({
      user_id: r.user_id,
      descripcion: r.descripcion,
      valor: r.valor,
      tipo: r.tipo,
      categoria: r.categoria,
      fecha,
    }));

    const { error: errorInsert } = await supabase
      .from("transactions")
      .insert(inserts);
    if (errorInsert) continue;

    const nuevaProxima = avanzarFecha(fechas[fechas.length - 1], r.frecuencia);
    await supabase
      .from("recurring_transactions")
      .update({ proxima_fecha: nuevaProxima })
      .eq("id", r.id);

    generadas += fechas.length;
  }

  revalidar();
  return { ok: true, generadas };
}
