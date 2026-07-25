import { describe, it, expect } from "vitest";
import {
  calcularResumen,
  agruparGastosPorCategoria,
  agruparPorMes,
} from "@/features/transacciones/resumen";
import type { Transaccion } from "@/types/transaccion";

function tx(parcial: Partial<Transaccion>): Transaccion {
  return {
    id: crypto.randomUUID(),
    user_id: "u1",
    descripcion: "x",
    valor: 0,
    tipo: "gasto",
    categoria: "otros",
    fecha: "2026-07-01",
    created_at: "2026-07-01T00:00:00Z",
    ...parcial,
  };
}

describe("calcularResumen", () => {
  it("suma ingresos y gastos y calcula el saldo", () => {
    const datos = [
      tx({ tipo: "ingreso", valor: 1000 }),
      tx({ tipo: "ingreso", valor: 500 }),
      tx({ tipo: "gasto", valor: 300 }),
      tx({ tipo: "gasto", valor: 200 }),
    ];
    expect(calcularResumen(datos)).toEqual({
      ingresos: 1500,
      gastos: 500,
      saldo: 1000,
    });
  });

  it("devuelve ceros sin transacciones", () => {
    expect(calcularResumen([])).toEqual({ ingresos: 0, gastos: 0, saldo: 0 });
  });
});

describe("agruparGastosPorCategoria", () => {
  it("agrupa solo gastos y ordena de mayor a menor", () => {
    const datos = [
      tx({ tipo: "gasto", categoria: "alimentacion", valor: 100 }),
      tx({ tipo: "gasto", categoria: "alimentacion", valor: 50 }),
      tx({ tipo: "gasto", categoria: "transporte", valor: 200 }),
      tx({ tipo: "ingreso", categoria: "salario", valor: 9000 }),
    ];
    const resultado = agruparGastosPorCategoria(datos);
    expect(resultado).toHaveLength(2);
    expect(resultado[0]).toMatchObject({
      categoriaId: "transporte",
      total: 200,
    });
    expect(resultado[1]).toMatchObject({
      categoriaId: "alimentacion",
      total: 150,
    });
  });
});

describe("agruparPorMes", () => {
  it("devuelve 12 meses y ubica cada transacción en su mes", () => {
    const datos = [
      tx({ tipo: "gasto", valor: 100, fecha: "2026-01-15" }),
      tx({ tipo: "ingreso", valor: 500, fecha: "2026-01-20" }),
      tx({ tipo: "gasto", valor: 200, fecha: "2026-03-05" }),
    ];
    const meses = agruparPorMes(datos);
    expect(meses).toHaveLength(12);
    expect(meses[0]).toMatchObject({
      mes: 1,
      ingresos: 500,
      gastos: 100,
      saldo: 400,
    });
    expect(meses[2]).toMatchObject({ mes: 3, gastos: 200, saldo: -200 });
    expect(meses[1]).toMatchObject({ mes: 2, ingresos: 0, gastos: 0 });
  });
});
