"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
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
import { PALETA_COLORES } from "@/lib/categorias";
import { crearCategoria } from "@/features/categorias/actions";
import type { EstadoCategoria } from "@/features/categorias/schemas";

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
        "Crear categoría"
      )}
    </Button>
  );
}

export function DialogoCategoria() {
  const [abierto, setAbierto] = useState(false);
  const [estado, formAction] = useActionState<EstadoCategoria, FormData>(
    crearCategoria,
    {},
  );
  const [tipo, setTipo] = useState("gasto");
  const [color, setColor] = useState(PALETA_COLORES[0].valor);

  useEffect(() => {
    if (estado.ok) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- cerrar el diálogo al confirmar la acción del servidor
      setAbierto(false);
      toast.success("Categoría creada.");
    }
  }, [estado.ok]);

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            Nueva categoría
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva categoría</DialogTitle>
          <DialogDescription>
            Crea una categoría personalizada para tus transacciones.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              maxLength={40}
              placeholder="Ej. Mascotas"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Aplica en</Label>
              <Select
                name="tipo"
                value={tipo}
                onValueChange={(v) => setTipo(v ?? "gasto")}
              >
                <SelectTrigger className="w-full" aria-label="Aplica en">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasto">Gasto</SelectItem>
                  <SelectItem value="ingreso">Ingreso</SelectItem>
                  <SelectItem value="ambos">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Select
                name="color"
                value={color}
                onValueChange={(v) => setColor(v ?? PALETA_COLORES[0].valor)}
              >
                <SelectTrigger className="w-full" aria-label="Color">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  {PALETA_COLORES.map((c) => (
                    <SelectItem key={c.valor} value={c.valor}>
                      <span
                        aria-hidden="true"
                        className="size-3 rounded-full"
                        style={{ backgroundColor: c.valor }}
                      />
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
