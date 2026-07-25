import type { Metadata } from "next";
import { Plus, ArrowLeftRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Transacciones",
};

export default function TransaccionesPage() {
  return (
    <>
      <PageHeader
        titulo="Transacciones"
        descripcion="Registra, edita y filtra tus ingresos y gastos."
        acciones={
          <Button disabled>
            <Plus className="size-4" />
            Nueva transacción
          </Button>
        }
      />

      <Card>
        <CardContent>
          <EmptyState
            icono={ArrowLeftRight}
            titulo="Todavía no tienes transacciones"
            descripcion="El registro y la gestión de transacciones se habilitan en la siguiente fase, junto con la autenticación."
          />
        </CardContent>
      </Card>
    </>
  );
}
