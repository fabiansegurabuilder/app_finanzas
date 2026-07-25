"use client";

import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatearFecha, formatearMoneda } from "@/lib/format";
import type { Transaccion } from "@/types/transaccion";
import { CategoriaBadge } from "@/features/transacciones/components/categoria-badge";
import { DialogoTransaccion } from "@/features/transacciones/components/dialogo-transaccion";
import { DialogoEliminar } from "@/features/transacciones/components/dialogo-eliminar";

function MontoConSigno({ t }: { t: Transaccion }) {
  const esIngreso = t.tipo === "ingreso";
  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        esIngreso ? "text-success" : "text-destructive",
      )}
    >
      {esIngreso ? "+" : "−"}
      {formatearMoneda(t.valor)}
    </span>
  );
}

function AccionesFila({ t }: { t: Transaccion }) {
  return (
    <div className="flex justify-end gap-1">
      <DialogoTransaccion
        transaccion={t}
        trigger={
          <Button variant="ghost" size="icon" aria-label="Editar transacción">
            <Pencil className="size-4" />
          </Button>
        }
      />
      <DialogoEliminar
        id={t.id}
        descripcion={t.descripcion}
        trigger={
          <Button variant="ghost" size="icon" aria-label="Eliminar transacción">
            <Trash2 className="size-4" />
          </Button>
        }
      />
    </div>
  );
}

export function TablaTransacciones({
  transacciones,
}: {
  transacciones: Transaccion[];
}) {
  return (
    <>
      {/* Escritorio: tabla */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-24 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transacciones.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-muted-foreground whitespace-nowrap">
                  {formatearFecha(t.fecha)}
                </TableCell>
                <TableCell className="font-medium">{t.descripcion}</TableCell>
                <TableCell>
                  <CategoriaBadge categoriaId={t.categoria} />
                </TableCell>
                <TableCell className="text-right">
                  <MontoConSigno t={t} />
                </TableCell>
                <TableCell>
                  <AccionesFila t={t} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Móvil: tarjetas */}
      <ul className="space-y-3 md:hidden">
        {transacciones.map((t) => (
          <li
            key={t.id}
            className="border-border bg-card rounded-xl border p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="truncate font-medium">{t.descripcion}</p>
                <p className="text-muted-foreground text-xs">
                  {formatearFecha(t.fecha)}
                </p>
                <CategoriaBadge categoriaId={t.categoria} />
              </div>
              <div className="flex flex-col items-end gap-2">
                <MontoConSigno t={t} />
                <AccionesFila t={t} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
