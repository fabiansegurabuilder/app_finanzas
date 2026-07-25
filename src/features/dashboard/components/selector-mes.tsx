"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mesesRecientes } from "@/lib/fechas";

/** Selector de mes que sincroniza el parámetro `mes` de la URL. */
export function SelectorMes({ mes }: { mes: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, iniciarTransicion] = useTransition();

  const meses = mesesRecientes(12);

  function cambiarMes(valor: string | null) {
    if (!valor) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("mes", valor);
    iniciarTransicion(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <Select value={mes} onValueChange={cambiarMes}>
      <SelectTrigger className="w-full sm:w-52" aria-label="Seleccionar mes">
        <SelectValue placeholder="Mes" />
      </SelectTrigger>
      <SelectContent>
        {meses.map((m) => (
          <SelectItem key={m.valor} value={m.valor} className="capitalize">
            {m.etiqueta}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
