import type { Metadata } from "next";
import { PiggyBank, Target } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { formatearMoneda } from "@/lib/format";
import { listarMetas, totalAhorrado } from "@/features/metas/data";
import { DialogoMeta } from "@/features/metas/components/dialogo-meta";
import { TarjetaMeta } from "@/features/metas/components/tarjeta-meta";

export const metadata: Metadata = {
  title: "Metas",
};

export default async function MetasPage() {
  const metas = await listarMetas();
  const ahorro = totalAhorrado(metas);
  const objetivo = metas.reduce((s, m) => s + m.montoObjetivo, 0);

  return (
    <>
      <PageHeader
        titulo="Metas de ahorro"
        descripcion="Define objetivos, registra aportes y sigue tu progreso."
        acciones={<DialogoMeta />}
      />

      {metas.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            titulo="Ahorro acumulado"
            valor={formatearMoneda(ahorro)}
            icono={PiggyBank}
            tono="ingreso"
            detalle={`${metas.length} ${metas.length === 1 ? "meta" : "metas"}`}
          />
          <StatCard
            titulo="Objetivo total"
            valor={formatearMoneda(objetivo)}
            icono={Target}
            tono="neutro"
          />
        </div>
      ) : null}

      {metas.length === 0 ? (
        <EmptyState
          icono={PiggyBank}
          titulo="Aún no tienes metas"
          descripcion="Crea tu primera meta de ahorro y empieza a registrar aportes."
          accion={<DialogoMeta />}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {metas.map((meta) => (
            <TarjetaMeta key={meta.id} meta={meta} />
          ))}
        </div>
      )}
    </>
  );
}
