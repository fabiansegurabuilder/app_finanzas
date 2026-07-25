"use client";

import { useEffect, useState } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OPCIONES = [
  { valor: "light", etiqueta: "Claro", icono: Sun },
  { valor: "dark", etiqueta: "Oscuro", icono: Moon },
  { valor: "system", etiqueta: "Sistema", icono: Monitor },
] as const;

/** Menú para elegir el tema: claro, oscuro o el del sistema. */
export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- patrón "montado" intencional para next-themes
    setMontado(true);
  }, []);

  const esOscuro = montado && resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Cambiar tema" />
        }
      >
        {esOscuro ? <Moon className="size-4" /> : <Sun className="size-4" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {OPCIONES.map((opcion) => {
          const Icono = opcion.icono;
          const activo = montado && theme === opcion.valor;
          return (
            <DropdownMenuItem
              key={opcion.valor}
              onClick={() => setTheme(opcion.valor)}
            >
              <Icono className="size-4" />
              {opcion.etiqueta}
              {activo ? <Check className="ml-auto size-4" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
