"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mesesRecientes,
  aniosRecientes,
  mesActual,
  anioActual,
} from "@/lib/fechas";

export type Vista = "mes" | "anio";

interface SelectorPeriodoProps {
  vista: Vista;
  mes: string;
  anio: string;
}

/** Alterna entre ver un mes o un año y sincroniza la URL. */
export function SelectorPeriodo({ vista, mes, anio }: SelectorPeriodoProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, iniciarTransicion] = useTransition();

  const meses = mesesRecientes(12);
  const anios = aniosRecientes(5);

  function navegar(params: URLSearchParams) {
    iniciarTransicion(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  function cambiarVista(nueva: Vista) {
    if (nueva === vista) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("vista", nueva);
    if (nueva === "anio") {
      params.delete("mes");
      params.set("anio", anio || anioActual());
    } else {
      params.delete("anio");
      params.set("mes", mes || mesActual());
    }
    navegar(params);
  }

  function cambiarValor(valor: string | null) {
    if (!valor) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set(vista === "anio" ? "anio" : "mes", valor);
    navegar(params);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="border-border bg-muted inline-flex rounded-lg border p-0.5">
        {(["mes", "anio"] as const).map((opcion) => (
          <button
            key={opcion}
            type="button"
            onClick={() => cambiarVista(opcion)}
            aria-pressed={vista === opcion}
            className={cn(
              "rounded-md px-3 py-1 text-sm font-medium transition-colors",
              vista === opcion
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opcion === "mes" ? "Mes" : "Año"}
          </button>
        ))}
      </div>

      {vista === "anio" ? (
        <Select value={anio} onValueChange={cambiarValor}>
          <SelectTrigger
            className="w-full sm:w-40"
            aria-label="Seleccionar año"
          >
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {anios.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Select value={mes} onValueChange={cambiarValor}>
          <SelectTrigger
            className="w-full sm:w-52"
            aria-label="Seleccionar mes"
          >
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
      )}
    </div>
  );
}
