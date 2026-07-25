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
import { eliminarTransaccion } from "@/features/transacciones/actions";

interface DialogoEliminarProps {
  id: string;
  descripcion: string;
  trigger: ReactElement;
}

/** Confirmación para eliminar una transacción. */
export function DialogoEliminar({
  id,
  descripcion,
  trigger,
}: DialogoEliminarProps) {
  const [abierto, setAbierto] = useState(false);
  const [pendiente, iniciarTransicion] = useTransition();

  function confirmar() {
    iniciarTransicion(async () => {
      const resultado = await eliminarTransaccion(id);
      if (resultado.error) {
        toast.error(resultado.error);
        return;
      }
      setAbierto(false);
      toast.success("Transacción eliminada.");
    });
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar transacción</DialogTitle>
          <DialogDescription>
            ¿Seguro que deseas eliminar «{descripcion}»? Esta acción no se puede
            deshacer.
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
