"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EstadoAuth } from "@/features/auth/schemas";

type AccionAuth = (
  estado: EstadoAuth,
  formData: FormData,
) => Promise<EstadoAuth>;

interface AuthFormProps {
  accion: AccionAuth;
  textoBoton: string;
  /** Ruta a la que redirigir tras iniciar sesión (solo login). */
  redirectTo?: string;
}

function BotonEnviar({ texto }: { texto: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Procesando…
        </>
      ) : (
        texto
      )}
    </Button>
  );
}

/** Formulario reutilizable para iniciar sesión y registrarse. */
export function AuthForm({ accion, textoBoton, redirectTo }: AuthFormProps) {
  const [estado, formAction] = useActionState<EstadoAuth, FormData>(accion, {});

  return (
    <form action={formAction} className="space-y-4">
      {redirectTo ? (
        <input type="hidden" name="redirect" value={redirectTo} />
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Mínimo 6 caracteres"
          required
        />
      </div>

      {estado.error ? (
        <p
          role="alert"
          className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
        >
          <AlertCircle className="size-4 shrink-0" />
          {estado.error}
        </p>
      ) : null}

      {estado.mensaje ? (
        <p
          role="status"
          className="bg-success/10 text-success flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          {estado.mensaje}
        </p>
      ) : null}

      <BotonEnviar texto={textoBoton} />
    </form>
  );
}
