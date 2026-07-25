"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/** Botón para alternar entre modo claro y oscuro. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);

  // Evita el desajuste de hidratación: el tema real solo se conoce en cliente.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- patrón "montado" intencional para next-themes
    setMontado(true);
  }, []);

  const esOscuro = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={esOscuro ? "Activar modo claro" : "Activar modo oscuro"}
      title={esOscuro ? "Modo claro" : "Modo oscuro"}
      onClick={() => setTheme(esOscuro ? "light" : "dark")}
    >
      {montado ? (
        esOscuro ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )
      ) : (
        // Placeholder sin icono hasta montar (evita parpadeo/mismatch).
        <Sun className="size-4 opacity-0" />
      )}
    </Button>
  );
}
