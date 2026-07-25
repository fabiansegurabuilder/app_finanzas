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
import { mesActual, etiquetaMes } from "@/lib/fechas";
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

  const transacciones = await listarTransacciones({ mes });
  const { ingresos, gastos, saldo } = calcularResumen(transacciones);
  const gastosPorCategoria = agruparGastosPorCategoria(transacciones);
  const detalle = etiquetaMes(mes);

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
        />
        <StatCard
          titulo="Gastos"
          valor={formatearMoneda(gastos)}
          icono={TrendingDown}
          tono="gasto"
          detalle={detalle}
        />
        <StatCard
          titulo="Saldo"
          valor={formatearMoneda(saldo)}
          icono={Wallet}
          tono="neutro"
          detalle={detalle}
        />
      </div>

      <Card>
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
