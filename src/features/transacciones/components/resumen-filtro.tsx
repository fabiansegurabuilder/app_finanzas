import { cn } from "@/lib/utils";
import { formatearMoneda } from "@/lib/format";
import { calcularResumen } from "@/features/transacciones/resumen";
import type { Transaccion } from "@/types/transaccion";

/** Resumen de las transacciones actualmente filtradas. */
export function ResumenFiltro({
  transacciones,
}: {
  transacciones: Transaccion[];
}) {
  const { ingresos, gastos, saldo } = calcularResumen(transacciones);
  const cantidad = transacciones.length;

  return (
    <div
      aria-live="polite"
      className="animate-in fade-in slide-in-from-bottom-2 border-border bg-card flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border px-4 py-3 text-sm duration-500"
    >
      <span className="text-muted-foreground">
        <strong className="text-foreground font-semibold">{cantidad}</strong>{" "}
        {cantidad === 1 ? "movimiento" : "movimientos"}
      </span>
      <span className="text-muted-foreground">
        Ingresos:{" "}
        <strong className="text-success font-semibold">
          {formatearMoneda(ingresos)}
        </strong>
      </span>
      <span className="text-muted-foreground">
        Gastos:{" "}
        <strong className="text-destructive font-semibold">
          {formatearMoneda(gastos)}
        </strong>
      </span>
      <span className="text-muted-foreground">
        Saldo:{" "}
        <strong
          className={cn(
            "font-semibold",
            saldo >= 0 ? "text-success" : "text-destructive",
          )}
        >
          {formatearMoneda(saldo)}
        </strong>
      </span>
    </div>
  );
}
