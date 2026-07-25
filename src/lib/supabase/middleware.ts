import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { obtenerSupabaseEnv, supabaseConfigurado } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

/** Rutas que requieren sesión iniciada. */
const RUTAS_PROTEGIDAS = ["/dashboard", "/transacciones"];
/** Rutas de autenticación (inaccesibles si ya hay sesión). */
const RUTAS_AUTH = ["/login", "/registro"];

function coincide(rutas: string[], pathname: string): boolean {
  return rutas.some(
    (ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`),
  );
}

/**
 * Refresca la sesión de Supabase en cada request y aplica las reglas de
 * redirección para rutas protegidas y de autenticación.
 */
export async function actualizarSesion(
  request: NextRequest,
): Promise<NextResponse> {
  // Sin configuración de Supabase se omite la lógica de sesión para no romper
  // el arranque (por ejemplo, antes de definir `.env.local`).
  if (!supabaseConfigurado()) {
    return NextResponse.next({ request });
  }

  let respuesta = NextResponse.next({ request });
  const { url, anonKey } = obtenerSupabaseEnv();

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        respuesta = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          respuesta.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user && coincide(RUTAS_PROTEGIDAS, pathname)) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/login";
    destino.searchParams.set("redirect", pathname);
    return NextResponse.redirect(destino);
  }

  if (user && coincide(RUTAS_AUTH, pathname)) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/dashboard";
    destino.searchParams.delete("redirect");
    return NextResponse.redirect(destino);
  }

  return respuesta;
}
