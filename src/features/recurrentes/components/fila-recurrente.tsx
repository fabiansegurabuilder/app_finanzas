"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Pause, Play, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatearMoneda, formatearFecha } from "@/lib/format";
import type { Catalogo } from "@/lib/categorias";
import { CategoriaBadge } from "@/features/transacciones/components/categoria-badge";
import { ETIQUETA_FRECUENCIA } from "@/features/recurrentes/logica";
import {
  alternarRecurrente,
  eliminarRecurrente,
} from "@/features/recurrentes/actions";
import type { Recurrente } from "@/features/recurrentes/types";

export function FilaRecurrente({
  recurrente,
  catalogo,
}: {
  recurrente: Recurrente;
  catalogo: Catalogo;
}) {
  const [pendiente, iniciarTransicion] = useTransition();
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const esIngreso = recurrente.tipo === "ingreso";

  function alternar() {
    iniciarTransicion(async () => {
      const r = await alternarRecurrente(recurrente.id, !recurrente.activa);
      if (r.error) {
        toast.error(r.error);
        return;
      }
      toast.success(
        recurrente.activa ? "Recurrente pausada." : "Recurrente activada.",
      );
    });
  }

  function eliminar() {
    iniciarTransicion(async () => {
      const r = await eliminarRecurrente(recurrente.id);
      if (r.error) {
        toast.error(r.error);
        return;
      }
      setDialogoAbierto(false);
      toast.success("Recurrente eliminada.");
    });
  }

  return (
    <div className="border-border bg-card flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-foreground truncate font-medium">
            {recurrente.descripcion}
          </p>
          <Badge variant="secondary">
            {ETIQUETA_FRECUENCIA[recurrente.frecuencia]}
          </Badge>
          {!recurrente.activa ? <Badge variant="outline">Pausada</Badge> : null}
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <CategoriaBadge
            categoriaId={recurrente.categoria}
            catalogo={catalogo}
          />
          <span>Próxima: {formatearFecha(recurrente.proximaFecha)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <span
          className={cn(
            "font-medium tabular-nums",
            esIngreso ? "text-success" : "text-destructive",
          )}
        >
          {esIngreso ? "+" : "−"}
          {formatearMoneda(recurrente.valor)}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={alternar}
            disabled={pendiente}
            aria-label={recurrente.activa ? "Pausar" : "Activar"}
            title={recurrente.activa ? "Pausar" : "Activar"}
          >
            {recurrente.activa ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
          </Button>
          <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Eliminar ${recurrente.descripcion}`}
                />
              }
            >
              <Trash2 className="size-4" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Eliminar recurrente</DialogTitle>
                <DialogDescription>
                  ¿Seguro que deseas eliminar «{recurrente.descripcion}»? No se
                  borran las transacciones ya generadas.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Cancelar
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={eliminar}
                  disabled={pendiente}
                >
                  {pendiente ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Eliminando…
                    </>
                  ) : (
                    "Eliminar"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
