import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { NavLinks } from "@/components/layout/nav-links";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserNav } from "@/components/layout/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { crearClienteServidor } from "@/lib/supabase/server";

/**
 * Layout del área autenticada. Exige sesión iniciada: si no hay usuario,
 * redirige a /login. La sesión se refresca además en el middleware.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "Usuario";

  return (
    <div className="flex min-h-svh w-full">
      <a
        href="#contenido"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
      >
        Saltar al contenido
      </a>
      {/* Sidebar (escritorio) */}
      <aside className="border-sidebar-border bg-sidebar hidden w-64 shrink-0 flex-col border-r md:flex">
        <div className="border-sidebar-border flex h-16 items-center justify-between border-b px-6">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks />
        </div>
        <div className="border-sidebar-border border-t p-4">
          <UserNav email={email} />
        </div>
      </aside>

      {/* Columna principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior (móvil) */}
        <header className="border-border bg-background flex h-16 items-center gap-3 border-b px-4 md:hidden">
          <MobileNav email={email} />
          <Logo />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <main id="contenido" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
