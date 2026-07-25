import Link from "next/link";
import { ChevronRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolverCategoria, type Catalogo } from "@/lib/categorias";
import { listarPresupuestos } from "@/features/presupuestos/data";
import { BarraPresupuesto } from "@/features/presupuestos/components/barra-presupuesto";

interface ProgresoPresupuestosProps {
  /** Gasto del mes por categoría. */
  gastadoPorCategoria: Record<string, number>;
  catalogo: Catalogo;
}

/** Tarjeta del dashboard con el avance de los presupuestos del mes. */
export async function ProgresoPresupuestos({
  gastadoPorCategoria,
  catalogo,
}: ProgresoPresupuestosProps) {
  const presupuestos = await listarPresupuestos();
  if (presupuestos.length === 0) return null;

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="text-muted-foreground size-4" aria-hidden="true" />
          Presupuestos del mes
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/presupuestos" />}
        >
          Gestionar
          <ChevronRight className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {presupuestos.map((p) => {
          const cat = resolverCategoria(catalogo, p.categoria);
          return (
            <BarraPresupuesto
              key={p.id}
              nombre={cat.nombre}
              color={cat.color}
              gastado={gastadoPorCategoria[p.categoria] ?? 0}
              limite={p.monto}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
