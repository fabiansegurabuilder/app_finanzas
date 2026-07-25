"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";

/** Límite de error para las vistas del área autenticada. */
export default function AppError({
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
    <EmptyState
      icono={AlertTriangle}
      titulo="Algo salió mal"
      descripcion="Ocurrió un error al cargar esta sección. Vuelve a intentarlo."
      accion={<Button onClick={reset}>Reintentar</Button>}
    />
  );
}
