import { obtenerCategoria } from "@/lib/categorias";

/** Muestra el nombre de una categoría con un punto de su color. */
export function CategoriaBadge({ categoriaId }: { categoriaId: string }) {
  const categoria = obtenerCategoria(categoriaId);
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span
        aria-hidden="true"
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: categoria.color }}
      />
      {categoria.nombre}
    </span>
  );
}
