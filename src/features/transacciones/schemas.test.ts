import { describe, it, expect } from "vitest";
import { transaccionSchema } from "@/features/transacciones/schemas";

const base = {
  descripcion: "Mercado",
  valor: "50000",
  tipo: "gasto",
  categoria: "alimentacion",
  fecha: "2026-07-10",
};

describe("transaccionSchema", () => {
  it("acepta datos válidos y convierte el valor a número", () => {
    const resultado = transaccionSchema.safeParse(base);
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.valor).toBe(50000);
    }
  });

  it("rechaza valores no positivos", () => {
    const resultado = transaccionSchema.safeParse({ ...base, valor: "0" });
    expect(resultado.success).toBe(false);
  });

  it("rechaza descripción vacía", () => {
    const resultado = transaccionSchema.safeParse({ ...base, descripcion: "" });
    expect(resultado.success).toBe(false);
  });

  it("rechaza una categoría que no corresponde al tipo", () => {
    // 'alimentacion' es de gasto; con tipo 'ingreso' debe fallar.
    const resultado = transaccionSchema.safeParse({ ...base, tipo: "ingreso" });
    expect(resultado.success).toBe(false);
  });

  it("acepta la categoría 'otros' en ingresos y gastos", () => {
    expect(
      transaccionSchema.safeParse({
        ...base,
        tipo: "ingreso",
        categoria: "otros",
      }).success,
    ).toBe(true);
  });

  it("rechaza una fecha con formato inválido", () => {
    const resultado = transaccionSchema.safeParse({
      ...base,
      fecha: "10/07/2026",
    });
    expect(resultado.success).toBe(false);
  });
});
