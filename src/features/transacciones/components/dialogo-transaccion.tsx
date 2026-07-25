"use client";

import { useState, type ReactElement } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormularioTransaccion } from "@/features/transacciones/components/formulario-transaccion";
import {
  crearTransaccion,
  actualizarTransaccion,
} from "@/features/transacciones/actions";
import type { Transaccion } from "@/types/transaccion";

interface DialogoTransaccionProps {
  /** Elemento que abre el diálogo (botón). */
  trigger: ReactElement;
  /** Si se pasa, el diálogo edita esa transacción; si no, crea una nueva. */
  transaccion?: Transaccion;
}

export function DialogoTransaccion({
  trigger,
  transaccion,
}: DialogoTransaccionProps) {
  const [abierto, setAbierto] = useState(false);
  const editando = Boolean(transaccion);

  const accion = transaccion
    ? actualizarTransaccion.bind(null, transaccion.id)
    : crearTransaccion;

  function alCompletar() {
    setAbierto(false);
    toast.success(
      editando ? "Transacción actualizada." : "Transacción registrada.",
    );
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editando ? "Editar transacción" : "Nueva transacción"}
          </DialogTitle>
          <DialogDescription>
            {editando
              ? "Modifica los datos y guarda los cambios."
              : "Registra un ingreso o un gasto."}
          </DialogDescription>
        </DialogHeader>
        <FormularioTransaccion
          accion={accion}
          transaccion={transaccion}
          onExito={alCompletar}
        />
      </DialogContent>
    </Dialog>
  );
}
