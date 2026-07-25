import Link from "next/link";
import { PiggyBank, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatearMoneda } from "@/lib/format";
import { listarMetas, totalAhorrado } from "@/features/metas/data";

/** Tarjeta con el ahorro acumulado en metas (oculta si no hay metas). */
export async function ResumenAhorro() {
  const metas = await listarMetas();
  if (metas.length === 0) return null;

  const ahorro = totalAhorrado(metas);
  const objetivo = metas.reduce((s, m) => s + m.montoObjetivo, 0);

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CardContent className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
            <PiggyBank className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Ahorro acumulado en metas
            </p>
            <p className="text-foreground text-2xl font-semibold tracking-tight">
              {formatearMoneda(ahorro)}
              <span className="text-muted-foreground ml-2 text-sm font-normal">
                de {formatearMoneda(objetivo)}
              </span>
            </p>
          </div>
        </div>
        <Button variant="outline" render={<Link href="/metas" />}>
          Ver metas
          <ChevronRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
