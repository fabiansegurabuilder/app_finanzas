"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_PRINCIPAL } from "@/config/nav";

interface NavLinksProps {
  /** Se invoca al hacer clic en un enlace (útil para cerrar el menú móvil). */
  onNavegar?: () => void;
}

/** Lista de enlaces de navegación con resaltado de la ruta activa. */
export function NavLinks({ onNavegar }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Navegación principal">
      {NAV_PRINCIPAL.map((item) => {
        const activo =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icono = item.icono;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavegar}
            aria-current={activo ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              activo
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground",
            )}
          >
            <Icono className="size-4" aria-hidden="true" />
            {item.titulo}
          </Link>
        );
      })}
    </nav>
  );
}
