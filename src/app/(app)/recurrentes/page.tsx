import type { Metadata } from "next";
import { Repeat } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { combinarCategorias, construirCatalogo } from "@/lib/categorias";
import { hoyISO } from "@/lib/fechas";
import { listarCategoriasUsuario } from "@/features/categorias/data";
import { listarRecurrentes } from "@/features/recurrentes/data";
import { contarPendientes } from "@/features/recurrentes/logica";
import { DialogoRecurrente } from "@/features/recurrentes/components/dialogo-recurrente";
import { BotonGenerar } from "@/features/recurrentes/components/boton-generar";
import { FilaRecurrente } from "@/features/recurrentes/components/fila-recurrente";

export const metadata: Metadata = {
  title: "Recurrentes",
};

export default async function RecurrentesPage() {
  const [recurrentes, personalizadas] = await Promise.all([
    listarRecurrentes(),
    listarCategoriasUsuario(),
  ]);
  const categorias = combinarCategorias(personalizadas);
  const catalogo = construirCatalogo(personalizadas);
  const pendientes = contarPendientes(recurrentes, hoyISO());

  return (
    <>
      <PageHeader
        titulo="Recurrentes"
        descripcion="Ingresos y gastos fijos que se generan automáticamente."
        acciones={
          <div className="flex flex-wrap gap-2">
            {recurrentes.length > 0 ? (
              <BotonGenerar pendientes={pendientes} />
            ) : null}
            <DialogoRecurrente categorias={categorias} />
          </div>
        }
      />

      {pendientes > 0 ? (
        <div
          role="status"
          className="border-primary/30 bg-primary/5 text-foreground rounded-xl border px-4 py-3 text-sm"
        >
          Tienes <strong>{pendientes}</strong>{" "}
          {pendientes === 1 ? "movimiento pendiente" : "movimientos pendientes"}{" "}
          por generar. Usa «Generar pendientes» para registrarlos.
        </div>
      ) : null}

      {recurrentes.length === 0 ? (
        <EmptyState
          icono={Repeat}
          titulo="Aún no tienes recurrentes"
          descripcion="Crea tus ingresos y gastos fijos (salario, arriendo, suscripciones) y deja que la app los registre por ti."
          accion={<DialogoRecurrente categorias={categorias} />}
        />
      ) : (
        <div className="space-y-3">
          {recurrentes.map((r) => (
            <FilaRecurrente key={r.id} recurrente={r} catalogo={catalogo} />
          ))}
        </div>
      )}
    </>
  );
}
