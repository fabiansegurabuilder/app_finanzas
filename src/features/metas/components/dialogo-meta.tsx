"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { crearMeta } from "@/features/metas/actions";
import type { EstadoMeta } from "@/features/metas/schemas";

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Creando…
        </>
      ) : (
        "Crear meta"
      )}
    </Button>
  );
}

export function DialogoMeta() {
  const [abierto, setAbierto] = useState(false);
  const [estado, formAction] = useActionState<EstadoMeta, FormData>(
    crearMeta,
    {},
  );

  useEffect(() => {
    if (estado.ok) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- cerrar el diálogo al confirmar la acción del servidor
      setAbierto(false);
      toast.success("Meta creada.");
    }
  }, [estado.ok]);

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            Nueva meta
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva meta de ahorro</DialogTitle>
          <DialogDescription>
            Define cuánto quieres ahorrar y, si quieres, una fecha límite.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              maxLength={60}
              placeholder="Ej. Fondo de emergencia"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="montoObjetivo">Monto objetivo</Label>
              <Input
                id="montoObjetivo"
                name="montoObjetivo"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaLimite">Fecha límite (opcional)</Label>
              <Input id="fechaLimite" name="fechaLimite" type="date" />
            </div>
          </div>

          {estado.error ? (
            <p role="alert" className="text-destructive text-sm">
              {estado.error}
            </p>
          ) : null}

          <div className="flex justify-end pt-2">
            <BotonGuardar />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
