import type { Metadata } from "next";
import { Plus, ArrowLeftRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mesActual } from "@/lib/fechas";
import { listarTransacciones } from "@/features/transacciones/data";
import { FiltrosTransacciones } from "@/features/transacciones/components/filtros-transacciones";
import { TablaTransacciones } from "@/features/transacciones/components/tabla-transacciones";
import { DialogoTransaccion } from "@/features/transacciones/components/dialogo-transaccion";
import { BotonExportar } from "@/features/transacciones/components/boton-exportar";

export const metadata: Metadata = {
  title: "Transacciones",
};

interface TransaccionesPageProps {
  searchParams: Promise<{ mes?: string; categoria?: string; q?: string }>;
}

export default async function TransaccionesPage({
  searchParams,
}: TransaccionesPageProps) {
  const { mes: mesParam, categoria, q } = await searchParams;
  const mes = mesParam ?? mesActual();

  const transacciones = await listarTransacciones({ mes, categoria, q });
  const hayFiltrosTexto = Boolean(q || categoria);

  return (
    <>
      <PageHeader
        titulo="Transacciones"
        descripcion="Registra, edita y filtra tus ingresos y gastos."
        acciones={
          <>
            <BotonExportar transacciones={transacciones} mes={mes} />
            <DialogoTransaccion
              trigger={
                <Button>
                  <Plus className="size-4" />
                  Nueva transacción
                </Button>
              }
            />
          </>
        }
      />

      <FiltrosTransacciones mes={mes} categoria={categoria} q={q} />

      {transacciones.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icono={ArrowLeftRight}
              titulo={
                hayFiltrosTexto
                  ? "Sin resultados"
                  : "Todavía no tienes transacciones"
              }
              descripcion={
                hayFiltrosTexto
                  ? "Prueba con otros filtros o limpia la búsqueda."
                  : "Registra tu primer ingreso o gasto con el botón «Nueva transacción»."
              }
              accion={
                hayFiltrosTexto ? undefined : (
                  <DialogoTransaccion
                    trigger={
                      <Button>
                        <Plus className="size-4" />
                        Nueva transacción
                      </Button>
                    }
                  />
                )
              }
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <TablaTransacciones transacciones={transacciones} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
