import { z } from "zod";

export const metaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(60, "Máximo 60 caracteres."),
  montoObjetivo: z.coerce
    .number({ message: "Ingresa un monto válido." })
    .positive("El objetivo debe ser mayor a 0."),
  fechaLimite: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida.")
    .optional()
    .or(z.literal("")),
});

export const aporteSchema = z.object({
  monto: z.coerce
    .number({ message: "Ingresa un monto válido." })
    .positive("El monto debe ser mayor a 0."),
  tipo: z.enum(["aporte", "retiro"], { message: "Selecciona el tipo." }),
});

export interface EstadoMeta {
  ok?: boolean;
  error?: string;
}
