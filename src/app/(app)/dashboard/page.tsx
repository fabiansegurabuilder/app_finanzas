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

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  // Valores en cero mientras no haya persistencia (se conectan en la Fase 4).
  const ingresos = 0;
  const gastos = 0;
  const saldo = ingresos - gastos;

  return (
    <>
      <PageHeader
        titulo="Dashboard"
        descripcion="Resumen consolidado de tus ingresos, gastos y saldo del mes."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          titulo="Ingresos"
          valor={formatearMoneda(ingresos)}
          icono={TrendingUp}
          tono="ingreso"
        />
        <StatCard
          titulo="Gastos"
          valor={formatearMoneda(gastos)}
          icono={TrendingDown}
          tono="gasto"
        />
        <StatCard
          titulo="Saldo"
          valor={formatearMoneda(saldo)}
          icono={Wallet}
          tono="neutro"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gastos por categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icono={PieChartIcon}
            titulo="Aún no hay datos"
            descripcion="Cuando registres transacciones verás aquí la distribución de tus gastos por categoría."
          />
        </CardContent>
      </Card>
    </>
  );
}
