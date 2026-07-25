import type { Metadata } from "next";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUpCircle,
  ArrowDownCircle,
  Tag,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatearMoneda } from "@/lib/format";
import {
  mesActual,
  etiquetaMes,
  mesAnterior,
  anioActual,
  esAnioValido,
} from "@/lib/fechas";
import { construirCatalogo } from "@/lib/categorias";
import { listarTransacciones } from "@/features/transacciones/data";
import { listarCategoriasUsuario } from "@/features/categorias/data";
import {
  calcularResumen,
  agruparGastosPorCategoria,
  agruparPorMes,
} from "@/features/transacciones/resumen";
import { SelectorPeriodo, type Vista } from "@/components/selector-periodo";
import { GraficoCategorias } from "@/features/dashboard/components/grafico-categorias";
import { GraficoMensual } from "@/features/dashboard/components/grafico-mensual";
import { ResumenAhorro } from "@/features/metas/components/resumen-ahorro";

export const metadata: Metadata = {
  title: "Dashboard",
};

interface DashboardPageProps {
  searchParams: Promise<{ vista?: string; mes?: string; anio?: string }>;
}

/** Variación relativa respecto al período anterior (null si no hay base). */
function calcularDelta(actual: number, anterior: number): number | null {
  return anterior === 0 ? null : (actual - anterior) / anterior;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const vista: Vista = params.vista === "anio" ? "anio" : "mes";
  const mes = params.mes ?? mesActual();
  const anio =
    params.anio && esAnioValido(params.anio) ? params.anio : anioActual();

  const selector = <SelectorPeriodo vista={vista} mes={mes} anio={anio} />;

  if (vista === "anio") {
    const anioPrevio = String(Number(anio) - 1);
    const [transacciones, transaccionesPrev, personalizadas] =
      await Promise.all([
        listarTransacciones({ anio }),
        listarTransacciones({ anio: anioPrevio }),
        listarCategoriasUsuario(),
      ]);
    const catalogo = construirCatalogo(personalizadas);

    const { ingresos, gastos, saldo } = calcularResumen(transacciones);
    const previo = calcularResumen(transaccionesPrev);
    const mensual = agruparPorMes(transacciones);
    const gastosPorCategoria = agruparGastosPorCategoria(
      transacciones,
      catalogo,
    );
    const detalle = `Año ${anio}`;

    const conGasto = mensual.filter((m) => m.gastos > 0);
    const mayorGasto = conGasto.length
      ? conGasto.reduce((a, b) => (b.gastos > a.gastos ? b : a))
      : null;
    const menorGasto = conGasto.length
      ? conGasto.reduce((a, b) => (b.gastos < a.gastos ? b : a))
      : null;
    const categoriaTop = gastosPorCategoria[0] ?? null;

    return (
      <>
        <PageHeader
          titulo="Dashboard"
          descripcion="Histórico anual de tus ingresos y gastos."
          acciones={selector}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            titulo="Ingresos del año"
            valor={formatearMoneda(ingresos)}
            icono={TrendingUp}
            tono="ingreso"
            detalle={detalle}
            delta={calcularDelta(ingresos, previo.ingresos)}
            deltaMejorSiSube
          />
          <StatCard
            titulo="Gastos del año"
            valor={formatearMoneda(gastos)}
            icono={TrendingDown}
            tono="gasto"
            detalle={detalle}
            delta={calcularDelta(gastos, previo.gastos)}
            deltaMejorSiSube={false}
          />
          <StatCard
            titulo="Saldo del año"
            valor={formatearMoneda(saldo)}
            icono={Wallet}
            tono={saldo >= 0 ? "ingreso" : "gasto"}
            detalle={detalle}
            delta={calcularDelta(saldo, previo.saldo)}
            deltaMejorSiSube
          />
        </div>

        <ResumenAhorro />

        {/* Destacados del año */}
        <div className="grid gap-4 sm:grid-cols-3">
          <DestacadoCard
            icono={ArrowUpCircle}
            titulo="Mes de mayor gasto"
            principal={mayorGasto ? mayorGasto.etiqueta : "—"}
            secundario={
              mayorGasto ? formatearMoneda(mayorGasto.gastos) : "Sin gastos"
            }
            tono="gasto"
          />
          <DestacadoCard
            icono={ArrowDownCircle}
            titulo="Mes de menor gasto"
            principal={menorGasto ? menorGasto.etiqueta : "—"}
            secundario={
              menorGasto ? formatearMoneda(menorGasto.gastos) : "Sin gastos"
            }
            tono="ingreso"
          />
          <DestacadoCard
            icono={Tag}
            titulo="Categoría con más gasto"
            principal={categoriaTop ? categoriaTop.nombre : "—"}
            secundario={
              categoriaTop ? formatearMoneda(categoriaTop.total) : "Sin gastos"
            }
            tono="neutro"
          />
        </div>

        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <CardHeader>
            <CardTitle>Ingresos y gastos por mes</CardTitle>
          </CardHeader>
          <CardContent>
            {gastos === 0 && ingresos === 0 ? (
              <EmptyState
                icono={BarChart3}
                titulo="Sin movimientos este año"
                descripcion="Registra transacciones para ver el histórico mensual."
              />
            ) : (
              <GraficoMensual datos={mensual} />
            )}
          </CardContent>
        </Card>

        <Card className="animate-in fade-in slide-in-from-bottom-2 delay-100 duration-500">
          <CardHeader>
            <CardTitle>Gastos por categoría (año)</CardTitle>
          </CardHeader>
          <CardContent>
            {gastosPorCategoria.length === 0 ? (
              <EmptyState
                icono={PieChartIcon}
                titulo="Sin gastos este año"
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

  // Vista mensual
  const [transacciones, transaccionesPrev, personalizadas] = await Promise.all([
    listarTransacciones({ mes }),
    listarTransacciones({ mes: mesAnterior(mes) }),
    listarCategoriasUsuario(),
  ]);
  const catalogo = construirCatalogo(personalizadas);

  const { ingresos, gastos, saldo } = calcularResumen(transacciones);
  const previo = calcularResumen(transaccionesPrev);
  const gastosPorCategoria = agruparGastosPorCategoria(transacciones, catalogo);
  const detalle = etiquetaMes(mes);

  return (
    <>
      <PageHeader
        titulo="Dashboard"
        descripcion="Resumen consolidado de tus ingresos, gastos y saldo."
        acciones={selector}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          titulo="Ingresos"
          valor={formatearMoneda(ingresos)}
          icono={TrendingUp}
          tono="ingreso"
          detalle={detalle}
          delta={calcularDelta(ingresos, previo.ingresos)}
          deltaMejorSiSube
        />
        <StatCard
          titulo="Gastos"
          valor={formatearMoneda(gastos)}
          icono={TrendingDown}
          tono="gasto"
          detalle={detalle}
          delta={calcularDelta(gastos, previo.gastos)}
          deltaMejorSiSube={false}
        />
        <StatCard
          titulo="Saldo"
          valor={formatearMoneda(saldo)}
          icono={Wallet}
          tono={saldo >= 0 ? "ingreso" : "gasto"}
          detalle={detalle}
          delta={calcularDelta(saldo, previo.saldo)}
          deltaMejorSiSube
        />
      </div>

      <ResumenAhorro />

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

/** Tarjeta compacta de un dato destacado del año. */
function DestacadoCard({
  icono: Icono,
  titulo,
  principal,
  secundario,
  tono,
}: {
  icono: typeof Tag;
  titulo: string;
  principal: string;
  secundario: string;
  tono: "ingreso" | "gasto" | "neutro";
}) {
  const clases = {
    ingreso: "bg-success/10 text-success",
    gasto: "bg-destructive/10 text-destructive",
    neutro: "bg-primary/10 text-primary",
  }[tono];

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CardContent className="flex items-center gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${clases}`}
        >
          <Icono className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">{titulo}</p>
          <p className="text-foreground truncate font-semibold capitalize">
            {principal}
          </p>
          <p className="text-muted-foreground text-xs">{secundario}</p>
        </div>
      </CardContent>
    </Card>
  );
}
