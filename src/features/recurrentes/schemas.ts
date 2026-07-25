import { z } from "zod";

export const recurrenteSchema = z.object({
  descripcion: z
    .string()
    .trim()
    .min(1, "La descripción es obligatoria.")
    .max(200, "Máximo 200 caracteres."),
  valor: z.coerce
    .number({ message: "Ingresa un valor válido." })
    .positive("El valor debe ser mayor a 0."),
  tipo: z.enum(["ingreso", "gasto"], { message: "Selecciona el tipo." }),
  categoria: z.string().min(1, "Selecciona una categoría."),
  frecuencia: z.enum(["semanal", "quincenal", "mensual"], {
    message: "Selecciona la frecuencia.",
  }),
  proximaFecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha válida."),
});

export interface EstadoRecurrente {
  ok?: boolean;
  error?: string;
  /** Cantidad de transacciones generadas (solo para `generarPendientes`). */
  generadas?: number;
}
