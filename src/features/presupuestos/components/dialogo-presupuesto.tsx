"use client";

import { useActionState, useEffect, useState, type ReactElement } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Categoria } from "@/lib/categorias";
import { guardarPresupuesto } from "@/features/presupuestos/actions";
import type { EstadoPresupuesto } from "@/features/presupuestos/schemas";
import type { Presupuesto } from "@/features/presupuestos/types";

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Guardando…
        </>
      ) : (
        "Guardar"
      )}
    </Button>
  );
}

interface DialogoPresupuestoProps {
  trigger: ReactElement;
  /** Categorías de gasto disponibles para elegir (en creación). */
  categorias: Categoria[];
  /** Si se pasa, edita el presupuesto de esa categoría. */
  presupuesto?: Presupuesto;
  /** Nombre de la categoría (para el modo edición). */
  nombreCategoria?: string;
}

export function DialogoPresupuesto({
  trigger,
  categorias,
  presupuesto,
  nombreCategoria,
}: DialogoPresupuestoProps) {
  const [abierto, setAbierto] = useState(false);
  const [estado, formAction] = useActionState<EstadoPresupuesto, FormData>(
    guardarPresupuesto,
    {},
  );
  const [categoria, setCategoria] = useState(presupuesto?.categoria ?? "");
  const editando = Boolean(presupuesto);

  useEffect(() => {
    if (estado.ok) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- cerrar el diálogo al confirmar la acción del servidor
      setAbierto(false);
      toast.success(
        editando ? "Presupuesto actualizado." : "Presupuesto creado.",
      );
    }
  }, [estado.ok, editando]);

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editando ? "Editar presupuesto" : "Nuevo presupuesto"}
          </DialogTitle>
          <DialogDescription>
            Define el límite de gasto mensual para una categoría.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label>Categoría</Label>
            {editando ? (
              <>
                <Input value={nombreCategoria ?? ""} disabled readOnly />
                <input
                  type="hidden"
                  name="categoria"
                  value={presupuesto?.categoria}
                />
              </>
            ) : (
              <Select
                name="categoria"
                value={categoria}
                onValueChange={(v) => setCategoria(v ?? "")}
              >
                <SelectTrigger className="w-full" aria-label="Categoría">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="monto">Límite mensual</Label>
            <Input
              id="monto"
              name="monto"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              defaultValue={presupuesto?.monto}
              placeholder="0"
              required
            />
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
