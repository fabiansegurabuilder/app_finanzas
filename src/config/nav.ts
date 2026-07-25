import { LayoutDashboard, ArrowLeftRight, type LucideIcon } from "lucide-react";

export interface ItemNavegacion {
  titulo: string;
  href: string;
  icono: LucideIcon;
}

/** Enlaces principales del área autenticada. */
export const NAV_PRINCIPAL: readonly ItemNavegacion[] = [
  { titulo: "Dashboard", href: "/dashboard", icono: LayoutDashboard },
  { titulo: "Transacciones", href: "/transacciones", icono: ArrowLeftRight },
] as const;
