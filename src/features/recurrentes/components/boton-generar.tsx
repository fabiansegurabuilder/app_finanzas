"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generarPendientes } from "@/features/recurrentes/actions";

/** Genera las transacciones pendientes de las recurrentes activas. */
export function BotonGenerar({ pendientes }: { pendientes: number }) {
  const [procesando, iniciarTransicion] = useTransition();

  function generar() {
    iniciarTransicion(async () => {
      const resultado = await generarPendientes();
      if (resultado.error) {
        toast.error(resultado.error);
        return;
      }
      const n = resultado.generadas ?? 0;
      if (n === 0) {
        toast.info("No hay movimientos pendientes por generar.");
      } else {
        toast.success(
          `Se ${n === 1 ? "generó" : "generaron"} ${n} ${
            n === 1 ? "transacción" : "transacciones"
          }.`,
        );
      }
    });
  }

  return (
    <Button variant="outline" onClick={generar} disabled={procesando}>
      {procesando ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <RefreshCw className="size-4" />
      )}
      Generar pendientes{pendientes > 0 ? ` (${pendientes})` : ""}
    </Button>
  );
}
