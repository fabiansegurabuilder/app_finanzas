import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icono: LucideIcon;
  titulo: string;
  descripcion?: string;
  /** Acción principal (ej. botón para crear el primer registro). */
  accion?: ReactNode;
}

/** Estado vacío reutilizable para vistas sin datos. */
export function EmptyState({
  icono: Icono,
  titulo,
  descripcion,
  accion,
}: EmptyStateProps) {
  return (
    <div className="border-border bg-card/50 flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
      <div className="bg-accent text-accent-foreground flex size-12 items-center justify-center rounded-full">
        <Icono className="size-6" aria-hidden="true" />
      </div>
      <h3 className="text-foreground mt-4 text-base font-semibold">{titulo}</h3>
      {descripcion ? (
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          {descripcion}
        </p>
      ) : null}
      {accion ? <div className="mt-6">{accion}</div> : null}
    </div>
  );
}
