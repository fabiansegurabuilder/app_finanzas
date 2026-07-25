import { describe, it, expect } from "vitest";
import { generarCSV } from "@/features/transacciones/csv";
import type { Transaccion } from "@/types/transaccion";

const base: Transaccion = {
  id: "1",
  user_id: "u1",
  descripcion: "Mercado",
  valor: 120000,
  tipo: "gasto",
  categoria: "alimentacion",
  fecha: "2026-07-10",
  created_at: "2026-07-10T00:00:00Z",
};

describe("generarCSV", () => {
  it("incluye la cabecera y una fila por transacción", () => {
    const csv = generarCSV([base]);
    const lineas = csv.split("\n");
    expect(lineas[0]).toBe("Fecha,Descripción,Categoría,Tipo,Valor");
    expect(lineas[1]).toBe("2026-07-10,Mercado,Alimentación,Gasto,120000");
  });

  it("escapa descripciones con comas o comillas", () => {
    const csv = generarCSV([{ ...base, descripcion: 'Cena, con "amigos"' }]);
    expect(csv).toContain('"Cena, con ""amigos"""');
  });
});
