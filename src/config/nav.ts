import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  PiggyBank,
  Wallet,
  Repeat,
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
  { titulo: "Recurrentes", href: "/recurrentes", icono: Repeat },
  { titulo: "Presupuestos", href: "/presupuestos", icono: Wallet },
  { titulo: "Metas", href: "/metas", icono: PiggyBank },
  { titulo: "Categorías", href: "/categorias", icono: Tags },
] as const;
