"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
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
import { eliminarCategoria } from "@/features/categorias/actions";

export function BotonEliminarCategoria({
  id,
  nombre,
}: {
  id: string;
  nombre: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [pendiente, iniciarTransicion] = useTransition();

  function confirmar() {
    iniciarTransicion(async () => {
      const resultado = await eliminarCategoria(id);
      if (resultado.error) {
        toast.error(resultado.error);
        return;
      }
      setAbierto(false);
      toast.success("Categoría eliminada.");
    });
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Eliminar categoría ${nombre}`}
          />
        }
      >
        <Trash2 className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar categoría</DialogTitle>
          <DialogDescription>
            ¿Seguro que deseas eliminar «{nombre}»? Las transacciones que la
            usaban se mostrarán como «Otros».
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
