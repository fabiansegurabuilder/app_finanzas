import { z } from "zod";
import { CATEGORIAS_POR_ID } from "@/lib/categorias";

export const transaccionSchema = z
  .object({
    descripcion: z
      .string()
      .trim()
      .min(1, "La descripción es obligatoria.")
      .max(200, "Máximo 200 caracteres."),
    valor: z.coerce
      .number({ message: "Ingresa un valor numérico." })
      .positive("El valor debe ser mayor a 0."),
    tipo: z.enum(["ingreso", "gasto"], { message: "Selecciona el tipo." }),
    categoria: z.string().min(1, "Selecciona una categoría."),
    fecha: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha válida."),
  })
  .superRefine((datos, ctx) => {
    // Solo validamos coherencia para las categorías predefinidas. Las
    // personalizadas (uuid) se validan por pertenencia vía RLS al guardar.
    const categoria = CATEGORIAS_POR_ID[datos.categoria];
    if (
      categoria &&
      categoria.aplicaEn !== "ambos" &&
      categoria.aplicaEn !== datos.tipo
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["categoria"],
        message: "La categoría no corresponde al tipo seleccionado.",
      });
    }
  });

export type DatosTransaccion = z.infer<typeof transaccionSchema>;

/** Estado devuelto por las server actions del formulario. */
export interface EstadoTransaccion {
  ok?: boolean;
  error?: string;
}
