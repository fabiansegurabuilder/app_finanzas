import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORIAS } from "@/lib/categorias";
import { listarCategoriasUsuario } from "@/features/categorias/data";
import { DialogoCategoria } from "@/features/categorias/components/dialogo-categoria";
import { BotonEliminarCategoria } from "@/features/categorias/components/boton-eliminar-categoria";

export const metadata: Metadata = {
  title: "Categorías",
};

const ETIQUETA_TIPO: Record<string, string> = {
  ingreso: "Ingreso",
  gasto: "Gasto",
  ambos: "Ambos",
};

export default async function CategoriasPage() {
  const personalizadas = await listarCategoriasUsuario();

  return (
    <>
      <PageHeader
        titulo="Categorías"
        descripcion="Gestiona tus categorías: usa las predefinidas o crea las tuyas."
        acciones={<DialogoCategoria />}
      />

      <Card>
        <CardHeader>
          <CardTitle>Mis categorías</CardTitle>
        </CardHeader>
        <CardContent>
          {personalizadas.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Aún no has creado categorías personalizadas. Usa «Nueva categoría»
              para agregar una.
            </p>
          ) : (
            <ul className="divide-border divide-y">
              {personalizadas.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="size-3 shrink-0 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="truncate font-medium">{c.nombre}</span>
                    <Badge variant="secondary">
                      {ETIQUETA_TIPO[c.aplicaEn]}
                    </Badge>
                  </span>
                  <BotonEliminarCategoria id={c.id} nombre={c.nombre} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Predefinidas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-2">
            {CATEGORIAS.map((c) => (
              <li
                key={c.id}
                className="border-border inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
              >
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                {c.nombre}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
