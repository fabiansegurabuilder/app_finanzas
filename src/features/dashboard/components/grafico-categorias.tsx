"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatearMoneda } from "@/lib/format";
import type { GastoCategoria } from "@/features/transacciones/resumen";

interface GraficoCategoriasProps {
  datos: GastoCategoria[];
}

interface TooltipPayload {
  payload: GastoCategoria;
}

function TooltipPersonalizado({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="border-border bg-popover rounded-lg border px-3 py-2 text-sm shadow-md">
      <p className="text-popover-foreground font-medium">{item.nombre}</p>
      <p className="text-muted-foreground">{formatearMoneda(item.total)}</p>
    </div>
  );
}

/** Gráfico de pastel con la distribución de gastos por categoría. */
export function GraficoCategorias({ datos }: GraficoCategoriasProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={datos}
          dataKey="total"
          nameKey="nombre"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          strokeWidth={2}
          stroke="var(--background)"
        >
          {datos.map((item) => (
            <Cell key={item.categoriaId} fill={item.color} />
          ))}
        </Pie>
        <Tooltip content={<TooltipPersonalizado />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(valor) => (
            <span className="text-muted-foreground text-sm">{valor}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
