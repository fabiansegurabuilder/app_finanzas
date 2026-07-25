import { CalendarClock, CheckCircle2, PiggyBank, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatearMoneda,
  formatearFecha,
  formatearPorcentaje,
} from "@/lib/format";
import type { Meta } from "@/features/metas/types";
import { DialogoAporte } from "@/features/metas/components/dialogo-aporte";
import { BotonEliminarMeta } from "@/features/metas/components/boton-eliminar-meta";

export function TarjetaMeta({ meta }: { meta: Meta }) {
  const fraccion =
    meta.montoObjetivo > 0
      ? Math.min(1, meta.montoActual / meta.montoObjetivo)
      : 0;
  const completada = meta.montoActual >= meta.montoObjetivo;
  const faltante = Math.max(0, meta.montoObjetivo - meta.montoActual);

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
              <PiggyBank className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-foreground truncate font-semibold">
                {meta.nombre}
              </p>
              {meta.fechaLimite ? (
                <p className="text-muted-foreground flex items-center gap-1 text-xs">
                  <CalendarClock className="size-3" aria-hidden="true" />
                  Meta para {formatearFecha(meta.fechaLimite)}
                </p>
              ) : null}
            </div>
          </div>
          <BotonEliminarMeta id={meta.id} nombre={meta.nombre} />
        </div>

        {/* Barra de progreso */}
        <div className="space-y-1.5">
          <div
            className="bg-muted h-2.5 w-full overflow-hidden rounded-full"
            role="progressbar"
            aria-valuenow={Math.round(fraccion * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progreso de ${meta.nombre}`}
          >
            <div
              className={cn(
                "h-full rounded-full transition-all",
                completada ? "bg-success" : "bg-primary",
              )}
              style={{ width: `${fraccion * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground font-medium">
              {formatearMoneda(meta.montoActual)}
              <span className="text-muted-foreground">
                {" "}
                / {formatearMoneda(meta.montoObjetivo)}
              </span>
            </span>
            <span className="text-muted-foreground">
              {formatearPorcentaje(fraccion)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          {completada ? (
            <span className="text-success flex items-center gap-1 text-sm font-medium">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              ¡Meta alcanzada!
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">
              Faltan {formatearMoneda(faltante)}
            </span>
          )}
          <DialogoAporte
            metaId={meta.id}
            nombre={meta.nombre}
            trigger={
              <Button variant="outline" size="sm">
                <Plus className="size-4" />
                Registrar
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
