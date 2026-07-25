import { z } from "zod";

export const categoriaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(40, "Máximo 40 caracteres."),
  tipo: z.enum(["ingreso", "gasto", "ambos"], {
    message: "Selecciona dónde aplica.",
  }),
  color: z.string().min(1, "Selecciona un color."),
});

export interface EstadoCategoria {
  ok?: boolean;
  error?: string;
}
