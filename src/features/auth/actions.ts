"use server";

import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/server";
import { credencialesSchema, type EstadoAuth } from "@/features/auth/schemas";

/** Extrae y valida las credenciales del formulario. */
function leerCredenciales(formData: FormData) {
  return credencialesSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}

/** Inicia sesión con email y contraseña. */
export async function iniciarSesion(
  _prevState: EstadoAuth,
  formData: FormData,
): Promise<EstadoAuth> {
  const parseo = leerCredenciales(formData);
  if (!parseo.success) {
    return { error: parseo.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const redirectTo = (formData.get("redirect") as string) || "/dashboard";
  const supabase = await crearClienteServidor();
  const { error } = await supabase.auth.signInWithPassword(parseo.data);

  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  redirect(redirectTo);
}

/** Registra una cuenta nueva con email y contraseña. */
export async function registrarse(
  _prevState: EstadoAuth,
  formData: FormData,
): Promise<EstadoAuth> {
  const parseo = leerCredenciales(formData);
  if (!parseo.success) {
    return { error: parseo.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.auth.signUp(parseo.data);

  if (error) {
    return { error: error.message };
  }

  // Si el proyecto exige confirmación por correo, no habrá sesión activa.
  if (!data.session) {
    return {
      mensaje:
        "Cuenta creada. Revisa tu correo para confirmar el registro antes de iniciar sesión.",
    };
  }

  redirect("/dashboard");
}

/** Cierra la sesión actual. */
export async function cerrarSesion(): Promise<void> {
  const supabase = await crearClienteServidor();
  await supabase.auth.signOut();
  redirect("/login");
}
