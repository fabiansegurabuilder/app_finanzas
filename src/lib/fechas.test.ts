import { describe, it, expect } from "vitest";
import { rangoMes, esMesValido, mesActual } from "@/lib/fechas";

describe("rangoMes", () => {
  it("calcula el primer y último día de un mes", () => {
    expect(rangoMes("2026-02")).toEqual({
      inicio: "2026-02-01",
      fin: "2026-02-28",
    });
  });

  it("maneja meses de 31 días", () => {
    expect(rangoMes("2026-07")).toEqual({
      inicio: "2026-07-01",
      fin: "2026-07-31",
    });
  });
});

describe("esMesValido", () => {
  it("acepta el formato YYYY-MM", () => {
    expect(esMesValido("2026-07")).toBe(true);
  });

  it("rechaza otros formatos", () => {
    expect(esMesValido("2026/07")).toBe(false);
    expect(esMesValido("julio")).toBe(false);
  });
});

describe("mesActual", () => {
  it("devuelve el formato YYYY-MM", () => {
    expect(mesActual()).toMatch(/^\d{4}-\d{2}$/);
  });
});
