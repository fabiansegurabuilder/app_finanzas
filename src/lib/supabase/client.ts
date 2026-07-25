import { createBrowserClient } from "@supabase/ssr";
import { obtenerSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

/** Cliente de Supabase para componentes del navegador (Client Components). */
export function crearClienteNavegador() {
  const { url, anonKey } = obtenerSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}
