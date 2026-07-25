"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Límite de error global para las rutas fuera del área autenticada. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-full">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </div>
      <h1 className="text-foreground text-2xl font-bold tracking-tight">
        Algo salió mal
      </h1>
      <p className="text-muted-foreground max-w-md">
        Ocurrió un error inesperado. Vuelve a intentarlo o regresa al inicio.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Reintentar</Button>
        <Button variant="outline" render={<Link href="/" />}>
          Ir al inicio
        </Button>
      </div>
    </main>
  );
}
