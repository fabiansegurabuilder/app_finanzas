"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
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
import { categoriasPorTipo, type TipoTransaccion } from "@/lib/categorias";
import { hoyISO } from "@/lib/fechas";
import type { Transaccion } from "@/types/transaccion";
import type { EstadoTransaccion } from "@/features/transacciones/schemas";

type AccionTransaccion = (
  estado: EstadoTransaccion,
  formData: FormData,
) => Promise<EstadoTransaccion>;

interface FormularioTransaccionProps {
  accion: AccionTransaccion;
  transaccion?: Transaccion;
  /** Se invoca cuando la operación se completa con éxito. */
  onExito: () => void;
}

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

export function FormularioTransaccion({
  accion,
  transaccion,
  onExito,
}: FormularioTransaccionProps) {
  const [estado, formAction] = useActionState<EstadoTransaccion, FormData>(
    accion,
    {},
  );
  const [tipo, setTipo] = useState<TipoTransaccion>(
    transaccion?.tipo ?? "gasto",
  );
  const [categoria, setCategoria] = useState<string>(
    transaccion?.categoria ?? "",
  );

  const categorias = categoriasPorTipo(tipo);

  useEffect(() => {
    if (estado.ok) {
      onExito();
    }
  }, [estado.ok, onExito]);

  function cambiarTipo(nuevoTipo: string | null) {
    if (!nuevoTipo) return;
    const valor = nuevoTipo as TipoTransaccion;
    setTipo(valor);
    // Si la categoría actual no aplica al nuevo tipo, se limpia.
    const sigueValida = categoriasPorTipo(valor).some(
      (c) => c.id === categoria,
    );
    if (!sigueValida) setCategoria("");
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Input
          id="descripcion"
          name="descripcion"
          maxLength={200}
          defaultValue={transaccion?.descripcion}
          placeholder="Ej. Mercado del mes"
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
            defaultValue={transaccion?.valor}
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha">Fecha</Label>
          <Input
            id="fecha"
            name="fecha"
            type="date"
            defaultValue={transaccion?.fecha ?? hoyISO()}
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
              {categorias.map((c) => (
                <SelectItem key={c.id} value={c.id}>
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

      <div className="flex justify-end gap-2 pt-2">
        <BotonGuardar />
      </div>
    </form>
  );
}
