import type { Metadata } from "next";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import {
  combinarCategorias,
  construirCatalogo,
  filtrarPorTipo,
  resolverCategoria,
} from "@/lib/categorias";
import { mesActual, etiquetaMes } from "@/lib/fechas";
import { listarTransacciones } from "@/features/transacciones/data";
import { totalesGastoPorCategoria } from "@/features/transacciones/resumen";
import { listarCategoriasUsuario } from "@/features/categorias/data";
import { listarPresupuestos } from "@/features/presupuestos/data";
import { BarraPresupuesto } from "@/features/presupuestos/components/barra-presupuesto";
import { DialogoPresupuesto } from "@/features/presupuestos/components/dialogo-presupuesto";
import { BotonEliminarPresupuesto } from "@/features/presupuestos/components/boton-eliminar-presupuesto";

export const metadata: Metadata = {
  title: "Presupuestos",
};

export default async function PresupuestosPage() {
  const mes = mesActual();
  const [transacciones, personalizadas, presupuestos] = await Promise.all([
    listarTransacciones({ mes }),
    listarCategoriasUsuario(),
    listarPresupuestos(),
  ]);

  const catalogo = construirCatalogo(personalizadas);
  const gastado = totalesGastoPorCategoria(transacciones);
  const categoriasGasto = filtrarPorTipo(
    combinarCategorias(personalizadas),
    "gasto",
  );

  const conPresupuesto = new Set(presupuestos.map((p) => p.categoria));
  const disponibles = categoriasGasto.filter((c) => !conPresupuesto.has(c.id));

  const botonNuevo = (
    <DialogoPresupuesto
      categorias={disponibles}
      trigger={
        <Button disabled={disponibles.length === 0}>
          <Plus className="size-4" />
          Nuevo presupuesto
        </Button>
      }
    />
  );

  return (
    <>
      <PageHeader
        titulo="Presupuestos"
        descripcion={`Límites de gasto por categoría · ${etiquetaMes(mes)}`}
        acciones={botonNuevo}
      />

      {presupuestos.length === 0 ? (
        <EmptyState
          icono={Wallet}
          titulo="Aún no tienes presupuestos"
          descripcion="Define un límite de gasto mensual por categoría y controla en qué se te va el dinero."
          accion={botonNuevo}
        />
      ) : (
        <Card>
          <CardContent className="space-y-5">
            {presupuestos.map((p) => {
              const cat = resolverCategoria(catalogo, p.categoria);
              return (
                <BarraPresupuesto
                  key={p.id}
                  nombre={cat.nombre}
                  color={cat.color}
                  gastado={gastado[p.categoria] ?? 0}
                  limite={p.monto}
                  accion={
                    <span className="flex items-center">
                      <DialogoPresupuesto
                        categorias={categoriasGasto}
                        presupuesto={p}
                        nombreCategoria={cat.nombre}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Editar presupuesto de ${cat.nombre}`}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        }
                      />
                      <BotonEliminarPresupuesto
                        id={p.id}
                        nombre={cat.nombre}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Eliminar presupuesto de ${cat.nombre}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        }
                      />
                    </span>
                  }
                />
              );
            })}
          </CardContent>
        </Card>
      )}
    </>
  );
}
