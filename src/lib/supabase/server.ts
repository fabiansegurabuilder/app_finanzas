import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { obtenerSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

/**
 * Cliente de Supabase para el servidor (Server Components, Server Actions y
 * Route Handlers). Lee y escribe la sesión en cookies.
 */
export async function crearClienteServidor() {
  const cookieStore = await cookies();
  const { url, anonKey } = obtenerSupabaseEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // `setAll` se invoca desde un Server Component: se ignora porque el
          // refresco de sesión ya lo gestiona el middleware.
        }
      },
    },
  });
}
