import type { TransaccionRow } from "@/types/database";
import type { TipoTransaccion } from "@/lib/categorias";

/** Transacción tal como la usa la UI (equivale a una fila de la tabla). */
export type Transaccion = TransaccionRow;

export type { TipoTransaccion };
