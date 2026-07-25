"use client";

import { useState, useTransition, type ReactElement } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { eliminarPresupuesto } from "@/features/presupuestos/actions";

export function BotonEliminarPresupuesto({
  id,
  nombre,
  trigger,
}: {
  id: string;
  nombre: string;
  trigger: ReactElement;
}) {
  const [abierto, setAbierto] = useState(false);
  const [pendiente, iniciarTransicion] = useTransition();

  function confirmar() {
    iniciarTransicion(async () => {
      const resultado = await eliminarPresupuesto(id);
      if (resultado.error) {
        toast.error(resultado.error);
        return;
      }
      setAbierto(false);
      toast.success("Presupuesto eliminado.");
    });
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar presupuesto</DialogTitle>
          <DialogDescription>
            ¿Seguro que deseas eliminar el presupuesto de «{nombre}»?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancelar
          </DialogClose>
          <Button
            variant="destructive"
            onClick={confirmar}
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
  );
}
