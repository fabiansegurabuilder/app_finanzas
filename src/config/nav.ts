import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  type LucideIcon,
} from "lucide-react";

export interface ItemNavegacion {
  titulo: string;
  href: string;
  icono: LucideIcon;
}

/** Enlaces principales del área autenticada. */
export const NAV_PRINCIPAL: readonly ItemNavegacion[] = [
  { titulo: "Dashboard", href: "/dashboard", icono: LayoutDashboard },
  { titulo: "Transacciones", href: "/transacciones", icono: ArrowLeftRight },
  { titulo: "Categorías", href: "/categorias", icono: Tags },
] as const;
