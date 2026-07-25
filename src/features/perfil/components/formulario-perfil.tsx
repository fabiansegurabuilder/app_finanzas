"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { actualizarPerfil } from "@/features/perfil/actions";
import type { EstadoPerfil } from "@/features/perfil/schemas";

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
        "Guardar cambios"
      )}
    </Button>
  );
}

export function FormularioPerfil({ nombre }: { nombre: string }) {
  const [estado, formAction] = useActionState<EstadoPerfil, FormData>(
    actualizarPerfil,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre para mostrar</Label>
        <Input
          id="nombre"
          name="nombre"
          defaultValue={nombre}
          maxLength={80}
          placeholder="Ej. Rutina Financiera de Fabián"
          required
        />
      </div>

      {estado.error ? (
        <p
          role="alert"
          className="text-destructive flex items-center gap-2 text-sm"
        >
          <AlertCircle className="size-4 shrink-0" />
          {estado.error}
        </p>
      ) : null}
      {estado.ok && estado.mensaje ? (
        <p
          role="status"
          className="text-success flex items-center gap-2 text-sm"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          {estado.mensaje}
        </p>
      ) : null}

      <BotonGuardar />
    </form>
  );
}
