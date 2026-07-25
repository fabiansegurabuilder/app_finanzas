import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { formatearPorcentaje } from "@/lib/format";

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
  /** Variación respecto al período anterior (fracción, ej. 0.12 = +12%). */
  delta?: number | null;
  /** Si subir es positivo (ingresos/saldo) o negativo (gastos). */
  deltaMejorSiSube?: boolean;
}

function Variacion({
  delta,
  mejorSiSube,
}: {
  delta: number;
  mejorSiSube: boolean;
}) {
  const sube = delta > 0;
  const esBueno = sube === mejorSiSube;
  const Icono = sube ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
        delta === 0
          ? "bg-muted text-muted-foreground"
          : esBueno
            ? "bg-success/10 text-success"
            : "bg-destructive/10 text-destructive",
      )}
    >
      <Icono className="size-3" aria-hidden="true" />
      {formatearPorcentaje(Math.abs(delta))}
    </span>
  );
}

/** Tarjeta de indicador para el dashboard (ingreso, gasto, saldo). */
export function StatCard({
  titulo,
  valor,
  icono: Icono,
  tono = "neutro",
  detalle,
  delta,
  deltaMejorSiSube = true,
}: StatCardProps) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CardContent className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm font-medium">{titulo}</p>
          <p className="text-foreground text-2xl font-semibold tracking-tight">
            {valor}
          </p>
          <div className="flex items-center gap-2">
            {delta !== null && delta !== undefined ? (
              <Variacion delta={delta} mejorSiSube={deltaMejorSiSube} />
            ) : null}
            {detalle ? (
              <span className="text-muted-foreground text-xs">{detalle}</span>
            ) : null}
          </div>
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
