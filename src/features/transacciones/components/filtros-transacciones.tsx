"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIAS } from "@/lib/categorias";
import { mesesRecientes } from "@/lib/fechas";

const TODAS = "todas";

interface FiltrosTransaccionesProps {
  mes: string;
  categoria?: string;
  q?: string;
}

/** Barra de filtros que sincroniza mes, categoría y búsqueda con la URL. */
export function FiltrosTransacciones({
  mes,
  categoria,
  q,
}: FiltrosTransaccionesProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, iniciarTransicion] = useTransition();

  const meses = mesesRecientes(12);
  const [busqueda, setBusqueda] = useState(q ?? "");

  const actualizarParam = useCallback(
    (clave: string, valor: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (valor) {
        params.set(clave, valor);
      } else {
        params.delete(clave);
      }
      iniciarTransicion(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  // Búsqueda con retardo (debounce) para no navegar en cada tecla.
  useEffect(() => {
    const actual = searchParams.get("q") ?? "";
    if (busqueda === actual) return;
    const id = setTimeout(() => {
      actualizarParam("q", busqueda.trim() || null);
    }, 350);
    return () => clearTimeout(id);
  }, [busqueda, searchParams, actualizarParam]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por descripción…"
          aria-label="Buscar por descripción"
          className="pl-8"
        />
      </div>

      <Select value={mes} onValueChange={(v) => actualizarParam("mes", v)}>
        <SelectTrigger className="w-full sm:w-52" aria-label="Filtrar por mes">
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

      <Select
        value={categoria ?? TODAS}
        onValueChange={(v) =>
          actualizarParam("categoria", v === TODAS ? null : v)
        }
      >
        <SelectTrigger
          className="w-full sm:w-48"
          aria-label="Filtrar por categoría"
        >
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODAS}>Todas las categorías</SelectItem>
          {CATEGORIAS.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
