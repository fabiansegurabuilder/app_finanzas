"use server";

import { revalidatePath } from "next/cache";
import { crearClienteServidor } from "@/lib/supabase/server";
import {
  presupuestoSchema,
  type EstadoPresupuesto,
} from "@/features/presupuestos/schemas";

function revalidar() {
  revalidatePath("/presupuestos");
  revalidatePath("/dashboard");
}

/** Crea o actualiza el presupuesto de una categoría (uno por categoría). */
export async function guardarPresupuesto(
  _prevState: EstadoPresupuesto,
  formData: FormData,
): Promise<EstadoPresupuesto> {
  const parseo = presupuestoSchema.safeParse({
    categoria: formData.get("categoria"),
    monto: formData.get("monto"),
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

  const { error } = await supabase.from("budgets").upsert(
    {
      user_id: user.id,
      categoria: parseo.data.categoria,
      monto: parseo.data.monto,
    },
    { onConflict: "user_id,categoria" },
  );

  if (error) {
    return { error: "No se pudo guardar el presupuesto." };
  }

  revalidar();
  return { ok: true };
}

/** Elimina un presupuesto (propiedad garantizada por RLS). */
export async function eliminarPresupuesto(
  id: string,
): Promise<EstadoPresupuesto> {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from("budgets").delete().eq("id", id);

  if (error) {
    return { error: "No se pudo eliminar el presupuesto." };
  }

  revalidar();
  return { ok: true };
}
