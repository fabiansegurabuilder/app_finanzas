import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatearMoneda, formatearPorcentaje } from "@/lib/format";

interface BarraPresupuestoProps {
  nombre: string;
  color: string;
  gastado: number;
  limite: number;
  /** Acciones opcionales (editar/eliminar) mostradas a la derecha. */
  accion?: ReactNode;
}

/** Fila con el progreso de gasto frente al límite de una categoría. */
export function BarraPresupuesto({
  nombre,
  color,
  gastado,
  limite,
  accion,
}: BarraPresupuestoProps) {
  const fraccion = limite > 0 ? gastado / limite : 0;
  const excedido = gastado > limite;
  const enAlerta = !excedido && fraccion >= 0.8;
  const restante = limite - gastado;

  const colorBarra = excedido
    ? "var(--destructive)"
    : enAlerta
      ? "var(--chart-5)"
      : color;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-foreground truncate text-sm font-medium">
            {nombre}
          </span>
          {excedido ? (
            <AlertTriangle
              className="text-destructive size-4 shrink-0"
              aria-label="Presupuesto excedido"
            />
          ) : null}
        </span>
        <span className="flex shrink-0 items-center gap-2 text-sm">
          <span className="text-muted-foreground tabular-nums">
            {formatearMoneda(gastado)} / {formatearMoneda(limite)}
          </span>
          {accion}
        </span>
      </div>
      <div
        className="bg-muted h-2 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={Math.round(fraccion * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Presupuesto de ${nombre}`}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(100, fraccion * 100)}%`,
            backgroundColor: colorBarra,
          }}
        />
      </div>
      <p
        className={cn(
          "text-xs",
          excedido ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {excedido
          ? `Excedido por ${formatearMoneda(-restante)}`
          : `Te quedan ${formatearMoneda(restante)} · ${formatearPorcentaje(fraccion)}`}
      </p>
    </div>
  );
}
