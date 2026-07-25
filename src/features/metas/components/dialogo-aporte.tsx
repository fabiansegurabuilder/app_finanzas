"use client";

import { useActionState, useEffect, useState } from "react";
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
import { registrarAporte } from "@/features/metas/actions";
import type { EstadoMeta } from "@/features/metas/schemas";
import type { ReactElement } from "react";

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
        "Registrar"
      )}
    </Button>
  );
}

export function DialogoAporte({
  metaId,
  nombre,
  trigger,
}: {
  metaId: string;
  nombre: string;
  trigger: ReactElement;
}) {
  const [abierto, setAbierto] = useState(false);
  const [tipo, setTipo] = useState("aporte");
  const accion = registrarAporte.bind(null, metaId);
  const [estado, formAction] = useActionState<EstadoMeta, FormData>(accion, {});

  useEffect(() => {
    if (estado.ok) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- cerrar el diálogo al confirmar la acción del servidor
      setAbierto(false);
      toast.success("Movimiento registrado.");
    }
  }, [estado.ok]);

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar movimiento</DialogTitle>
          <DialogDescription>
            Aporta o retira dinero de «{nombre}».
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                name="tipo"
                value={tipo}
                onValueChange={(v) => setTipo(v ?? "aporte")}
              >
                <SelectTrigger
                  className="w-full"
                  aria-label="Tipo de movimiento"
                >
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aporte">Aporte</SelectItem>
                  <SelectItem value="retiro">Retiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="monto">Monto</Label>
              <Input
                id="monto"
                name="monto"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0"
                required
              />
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
