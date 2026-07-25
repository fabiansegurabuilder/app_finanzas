"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generarCSV, nombreArchivoCSV } from "@/features/transacciones/csv";
import type { Catalogo } from "@/lib/categorias";
import type { Transaccion } from "@/types/transaccion";

interface BotonExportarProps {
  transacciones: Transaccion[];
  mes?: string;
  catalogo?: Catalogo;
}

/** Exporta las transacciones filtradas a un archivo CSV. */
export function BotonExportar({
  transacciones,
  mes,
  catalogo,
}: BotonExportarProps) {
  function exportar() {
    // BOM UTF-8 para que Excel muestre correctamente los acentos.
    const contenido = "﻿" + generarCSV(transacciones, catalogo);
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombreArchivoCSV(mes);
    enlace.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      variant="outline"
      onClick={exportar}
      disabled={transacciones.length === 0}
    >
      <Download className="size-4" />
      Exportar CSV
    </Button>
  );
}
