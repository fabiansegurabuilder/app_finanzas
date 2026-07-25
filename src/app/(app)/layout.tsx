import type { ReactNode } from "react";
import { Logo } from "@/components/layout/logo";
import { NavLinks } from "@/components/layout/nav-links";
import { MobileNav } from "@/components/layout/mobile-nav";

/**
 * Layout del área autenticada.
 *
 * La protección real de rutas (redirección a login sin sesión) se
 * incorpora en la Fase 3, cuando se integre Supabase Auth.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh w-full">
      {/* Sidebar (escritorio) */}
      <aside className="border-sidebar-border bg-sidebar hidden w-64 shrink-0 flex-col border-r md:flex">
        <div className="border-sidebar-border flex h-16 items-center border-b px-6">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks />
        </div>
        <div className="border-sidebar-border border-t p-4">
          <p className="text-muted-foreground text-xs">
            App Finanzas Personales
          </p>
        </div>
      </aside>

      {/* Columna principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior (móvil) */}
        <header className="border-border bg-background flex h-16 items-center gap-3 border-b px-4 md:hidden">
          <MobileNav />
          <Logo />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
