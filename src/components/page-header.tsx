import type { ReactNode } from "react";

interface PageHeaderProps {
  titulo: string;
  descripcion?: string;
  /** Acciones alineadas a la derecha (ej. botones). */
  acciones?: ReactNode;
}

/** Encabezado estándar de una página del área autenticada. */
export function PageHeader({ titulo, descripcion, acciones }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          {titulo}
        </h1>
        {descripcion ? (
          <p className="text-muted-foreground text-sm">{descripcion}</p>
        ) : null}
      </div>
      {acciones ? (
        <div className="flex items-center gap-2">{acciones}</div>
      ) : null}
    </div>
  );
}
