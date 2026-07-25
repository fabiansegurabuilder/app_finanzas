/**
 * Lectura y validación de las variables de entorno de Supabase.
 *
 * La validación es perezosa (en tiempo de ejecución) para no romper el
 * `build` cuando las variables aún no están definidas.
 */

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

/** Devuelve la configuración de Supabase o lanza un error descriptivo. */
export function obtenerSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan variables de entorno de Supabase. Define NEXT_PUBLIC_SUPABASE_URL y " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local (ver .env.example).",
    );
  }

  return { url, anonKey };
}

/** Indica si Supabase está configurado (sin lanzar error). */
export function supabaseConfigurado(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
