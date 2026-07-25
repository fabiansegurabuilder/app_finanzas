"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatearMoneda, formatearPorcentaje } from "@/lib/format";
import type { GastoCategoria } from "@/features/transacciones/resumen";

interface GraficoCategoriasProps {
  datos: GastoCategoria[];
}

interface TooltipPayload {
  payload: GastoCategoria & { fraccion: number };
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
      <p className="text-muted-foreground">
        {formatearMoneda(item.total)} · {formatearPorcentaje(item.fraccion)}
      </p>
    </div>
  );
}

/** Gráfico de pastel con la distribución de gastos por categoría. */
export function GraficoCategorias({ datos }: GraficoCategoriasProps) {
  const total = datos.reduce((suma, d) => suma + d.total, 0);
  const datosConFraccion = datos.map((d) => ({
    ...d,
    fraccion: total > 0 ? d.total / total : 0,
  }));

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
      <div className="h-64 w-full max-w-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={datosConFraccion}
              dataKey="total"
              nameKey="nombre"
              innerRadius={58}
              outerRadius={95}
              paddingAngle={2}
              strokeWidth={2}
              stroke="var(--background)"
              labelLine={false}
              label={(props) => {
                const cx = Number(props.cx);
                const cy = Number(props.cy);
                const midAngle = Number(props.midAngle);
                const innerRadius = Number(props.innerRadius);
                const outerRadius = Number(props.outerRadius);
                const percent = Number(props.percent);
                if (!percent || percent < 0.08) return <g />;
                const radio = innerRadius + (outerRadius - innerRadius) * 0.5;
                const rad = Math.PI / 180;
                const x = cx + radio * Math.cos(-midAngle * rad);
                const y = cy + radio * Math.sin(-midAngle * rad);
                return (
                  <text
                    x={x}
                    y={y}
                    fill="var(--background)"
                    fontSize={12}
                    fontWeight={600}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {formatearPorcentaje(percent)}
                  </text>
                );
              }}
            >
              {datosConFraccion.map((item) => (
                <Cell key={item.categoriaId} fill={item.color} />
              ))}
            </Pie>
            <Tooltip content={<TooltipPersonalizado />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda con montos y porcentaje */}
      <ul className="w-full flex-1 space-y-2">
        {datosConFraccion.map((item) => (
          <li
            key={item.categoriaId}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-foreground truncate">{item.nombre}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="text-foreground font-medium tabular-nums">
                {formatearMoneda(item.total)}
              </span>
              <span className="text-muted-foreground w-10 text-right text-xs tabular-nums">
                {formatearPorcentaje(item.fraccion)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
