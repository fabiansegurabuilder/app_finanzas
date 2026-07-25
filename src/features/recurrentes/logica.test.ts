import { describe, it, expect } from "vitest";
import {
  avanzarFecha,
  ocurrenciasPendientes,
} from "@/features/recurrentes/logica";

describe("avanzarFecha", () => {
  it("avanza según la frecuencia", () => {
    expect(avanzarFecha("2026-01-10", "semanal")).toBe("2026-01-17");
    expect(avanzarFecha("2026-01-10", "quincenal")).toBe("2026-01-25");
    expect(avanzarFecha("2026-01-10", "mensual")).toBe("2026-02-10");
  });
});

describe("ocurrenciasPendientes", () => {
  it("incluye todas las fechas hasta hoy (inclusive)", () => {
    const fechas = ocurrenciasPendientes("2026-01-01", "mensual", "2026-03-15");
    expect(fechas).toEqual(["2026-01-01", "2026-02-01", "2026-03-01"]);
  });

  it("no genera nada si la próxima fecha es futura", () => {
    expect(
      ocurrenciasPendientes("2026-12-01", "mensual", "2026-07-01"),
    ).toEqual([]);
  });
});
