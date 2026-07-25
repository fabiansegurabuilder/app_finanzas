"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cambiarPassword } from "@/features/perfil/actions";
import type { EstadoPerfil } from "@/features/perfil/schemas";

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Actualizando…
        </>
      ) : (
        "Cambiar contraseña"
      )}
    </Button>
  );
}

export function FormularioPassword() {
  const [estado, formAction] = useActionState<EstadoPerfil, FormData>(
    cambiarPassword,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Limpia los campos al cambiar la contraseña con éxito.
  useEffect(() => {
    if (estado.ok) formRef.current?.reset();
  }, [estado.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Nueva contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 6 caracteres"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmar">Confirmar contraseña</Label>
        <Input
          id="confirmar"
          name="confirmar"
          type="password"
          autoComplete="new-password"
          placeholder="Repite la contraseña"
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
