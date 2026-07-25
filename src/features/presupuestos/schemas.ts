import { z } from "zod";

export const presupuestoSchema = z.object({
  categoria: z.string().min(1, "Selecciona una categoría."),
  monto: z.coerce
    .number({ message: "Ingresa un monto válido." })
    .positive("El límite debe ser mayor a 0."),
});

export interface EstadoPresupuesto {
  ok?: boolean;
  error?: string;
}
