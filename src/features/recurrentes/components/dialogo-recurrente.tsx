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
import {
  filtrarPorTipo,
  type Categoria,
  type TipoTransaccion,
} from "@/lib/categorias";
import { hoyISO } from "@/lib/fechas";
import { crearRecurrente } from "@/features/recurrentes/actions";
import type { EstadoRecurrente } from "@/features/recurrentes/schemas";

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
        "Crear recurrente"
      )}
    </Button>
  );
}

export function DialogoRecurrente({ categorias }: { categorias: Categoria[] }) {
  const [abierto, setAbierto] = useState(false);
  const [estado, formAction] = useActionState<EstadoRecurrente, FormData>(
    crearRecurrente,
    {},
  );
  const [tipo, setTipo] = useState<TipoTransaccion>("gasto");
  const [categoria, setCategoria] = useState("");

  const opciones = filtrarPorTipo(categorias, tipo);

  useEffect(() => {
    if (estado.ok) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- cerrar el diálogo al confirmar la acción del servidor
      setAbierto(false);
      toast.success("Recurrente creada.");
    }
  }, [estado.ok]);

  function cambiarTipo(v: string | null) {
    if (!v) return;
    const valor = v as TipoTransaccion;
    setTipo(valor);
    if (!filtrarPorTipo(categorias, valor).some((c) => c.id === categoria)) {
      setCategoria("");
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            Nueva recurrente
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva transacción recurrente</DialogTitle>
          <DialogDescription>
            Define un ingreso o gasto fijo y su frecuencia.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              name="descripcion"
              maxLength={200}
              placeholder="Ej. Arriendo"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proximaFecha">Primera fecha</Label>
              <Input
                id="proximaFecha"
                name="proximaFecha"
                type="date"
                defaultValue={hoyISO()}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select name="tipo" value={tipo} onValueChange={cambiarTipo}>
                <SelectTrigger className="w-full" aria-label="Tipo">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasto">Gasto</SelectItem>
                  <SelectItem value="ingreso">Ingreso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Frecuencia</Label>
              <Select name="frecuencia" defaultValue="mensual">
                <SelectTrigger className="w-full" aria-label="Frecuencia">
                  <SelectValue placeholder="Frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="quincenal">Quincenal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select
              name="categoria"
              value={categoria}
              onValueChange={(v) => setCategoria(v ?? "")}
            >
              <SelectTrigger className="w-full" aria-label="Categoría">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {opciones.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
