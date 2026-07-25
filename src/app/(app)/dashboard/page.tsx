import type { Metadata } from "next";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart as PieChartIcon,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatearMoneda } from "@/lib/format";
import { mesActual, etiquetaMes, mesAnterior } from "@/lib/fechas";
import { listarTransacciones } from "@/features/transacciones/data";
import {
  calcularResumen,
  agruparGastosPorCategoria,
} from "@/features/transacciones/resumen";
import { SelectorMes } from "@/features/dashboard/components/selector-mes";
import { GraficoCategorias } from "@/features/dashboard/components/grafico-categorias";

export const metadata: Metadata = {
  title: "Dashboard",
};

interface DashboardPageProps {
  searchParams: Promise<{ mes?: string }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { mes: mesParam } = await searchParams;
  const mes = mesParam ?? mesActual();

  const [transacciones, transaccionesPrev] = await Promise.all([
    listarTransacciones({ mes }),
    listarTransacciones({ mes: mesAnterior(mes) }),
  ]);

  const { ingresos, gastos, saldo } = calcularResumen(transacciones);
  const previo = calcularResumen(transaccionesPrev);
  const gastosPorCategoria = agruparGastosPorCategoria(transacciones);
  const detalle = etiquetaMes(mes);

  // Variación relativa respecto al mes anterior (null si no hay base).
  const delta = (actual: number, anterior: number): number | null =>
    anterior === 0 ? null : (actual - anterior) / anterior;

  return (
    <>
      <PageHeader
        titulo="Dashboard"
        descripcion="Resumen consolidado de tus ingresos, gastos y saldo."
        acciones={<SelectorMes mes={mes} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          titulo="Ingresos"
          valor={formatearMoneda(ingresos)}
          icono={TrendingUp}
          tono="ingreso"
          detalle={detalle}
          delta={delta(ingresos, previo.ingresos)}
          deltaMejorSiSube
        />
        <StatCard
          titulo="Gastos"
          valor={formatearMoneda(gastos)}
          icono={TrendingDown}
          tono="gasto"
          detalle={detalle}
          delta={delta(gastos, previo.gastos)}
          deltaMejorSiSube={false}
        />
        <StatCard
          titulo="Saldo"
          valor={formatearMoneda(saldo)}
          icono={Wallet}
          tono={saldo >= 0 ? "ingreso" : "gasto"}
          detalle={detalle}
          delta={delta(saldo, previo.saldo)}
          deltaMejorSiSube
        />
      </div>

      <Card className="animate-in fade-in slide-in-from-bottom-2 delay-100 duration-500">
        <CardHeader>
          <CardTitle>Gastos por categoría</CardTitle>
        </CardHeader>
        <CardContent>
          {gastosPorCategoria.length === 0 ? (
            <EmptyState
              icono={PieChartIcon}
              titulo="Sin gastos este mes"
              descripcion="Cuando registres gastos verás aquí su distribución por categoría."
            />
          ) : (
            <GraficoCategorias datos={gastosPorCategoria} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
