import type { Metadata } from "next";
import { Plus, ArrowLeftRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mesActual, anioActual, esAnioValido } from "@/lib/fechas";
import type { Vista } from "@/components/selector-periodo";
import { combinarCategorias, construirCatalogo } from "@/lib/categorias";
import { listarTransacciones } from "@/features/transacciones/data";
import { listarCategoriasUsuario } from "@/features/categorias/data";
import { FiltrosTransacciones } from "@/features/transacciones/components/filtros-transacciones";
import { TablaTransacciones } from "@/features/transacciones/components/tabla-transacciones";
import { DialogoTransaccion } from "@/features/transacciones/components/dialogo-transaccion";
import { BotonExportar } from "@/features/transacciones/components/boton-exportar";
import { ResumenFiltro } from "@/features/transacciones/components/resumen-filtro";

export const metadata: Metadata = {
  title: "Transacciones",
};

interface TransaccionesPageProps {
  searchParams: Promise<{
    vista?: string;
    mes?: string;
    anio?: string;
    categoria?: string;
    q?: string;
  }>;
}

export default async function TransaccionesPage({
  searchParams,
}: TransaccionesPageProps) {
  const params = await searchParams;
  const { categoria, q } = params;
  const vista: Vista = params.vista === "anio" ? "anio" : "mes";
  const mes = params.mes ?? mesActual();
  const anio =
    params.anio && esAnioValido(params.anio) ? params.anio : anioActual();

  const filtroPeriodo = vista === "anio" ? { anio } : { mes };
  const [transacciones, personalizadas] = await Promise.all([
    listarTransacciones({ ...filtroPeriodo, categoria, q }),
    listarCategoriasUsuario(),
  ]);
  const categorias = combinarCategorias(personalizadas);
  const catalogo = construirCatalogo(personalizadas);
  const hayFiltrosTexto = Boolean(q || categoria);
  const sufijoExport = vista === "anio" ? anio : mes;

  return (
    <>
      <PageHeader
        titulo="Transacciones"
        descripcion="Registra, edita y filtra tus ingresos y gastos."
        acciones={
          <>
            <BotonExportar
              transacciones={transacciones}
              mes={sufijoExport}
              catalogo={catalogo}
            />
            <DialogoTransaccion
              categorias={categorias}
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

      <FiltrosTransacciones
        vista={vista}
        mes={mes}
        anio={anio}
        categoria={categoria}
        q={q}
        categorias={categorias}
      />

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
                    categorias={categorias}
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
        <>
          <ResumenFiltro transacciones={transacciones} />
          <Card>
            <CardContent>
              <TablaTransacciones
                transacciones={transacciones}
                categorias={categorias}
                catalogo={catalogo}
              />
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
