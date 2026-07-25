import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type Tono = "neutro" | "ingreso" | "gasto";

const TONO_ICONO: Record<Tono, string> = {
  neutro: "bg-primary/10 text-primary",
  ingreso: "bg-success/10 text-success",
  gasto: "bg-destructive/10 text-destructive",
};

interface StatCardProps {
  titulo: string;
  valor: string;
  icono: LucideIcon;
  tono?: Tono;
  /** Texto secundario opcional (ej. período). */
  detalle?: string;
}

/** Tarjeta de indicador para el dashboard (ingreso, gasto, saldo). */
export function StatCard({
  titulo,
  valor,
  icono: Icono,
  tono = "neutro",
  detalle,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm font-medium">{titulo}</p>
          <p className="text-foreground text-2xl font-semibold tracking-tight">
            {valor}
          </p>
          {detalle ? (
            <p className="text-muted-foreground text-xs">{detalle}</p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            TONO_ICONO[tono],
          )}
        >
          <Icono className="size-5" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}
