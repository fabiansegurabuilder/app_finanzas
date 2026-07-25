"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatearMoneda } from "@/lib/format";
import type { ResumenMensual } from "@/features/transacciones/resumen";

interface GraficoMensualProps {
  datos: ResumenMensual[];
}

interface BarraPayload {
  name: string;
  value: number;
  color: string;
}

function TooltipPersonalizado({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: BarraPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border-border bg-popover rounded-lg border px-3 py-2 text-sm shadow-md">
      <p className="text-popover-foreground mb-1 font-medium capitalize">
        {label}
      </p>
      {payload.map((serie) => (
        <p key={serie.name} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full"
            style={{ backgroundColor: serie.color }}
          />
          <span className="text-muted-foreground">{serie.name}:</span>
          <span className="text-foreground font-medium">
            {formatearMoneda(serie.value)}
          </span>
        </p>
      ))}
    </div>
  );
}

/** Compacta valores para el eje Y (ej. 1.2M, 350k). */
function formatoEje(valor: number): string {
  if (valor >= 1_000_000) return `${(valor / 1_000_000).toFixed(1)}M`;
  if (valor >= 1_000) return `${Math.round(valor / 1_000)}k`;
  return String(valor);
}

/** Gráfico de barras con ingresos y gastos por mes del año. */
export function GraficoMensual({ datos }: GraficoMensualProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={datos} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="etiqueta"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          stroke="var(--muted-foreground)"
        />
        <YAxis
          tickFormatter={formatoEje}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          width={44}
          stroke="var(--muted-foreground)"
        />
        <Tooltip
          content={<TooltipPersonalizado />}
          cursor={{ fill: "var(--muted)", opacity: 0.4 }}
        />
        <Bar
          dataKey="ingresos"
          name="Ingresos"
          fill="var(--success)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="gastos"
          name="Gastos"
          fill="var(--destructive)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
