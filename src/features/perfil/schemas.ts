import { z } from "zod";

export const perfilSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(80, "Máximo 80 caracteres."),
});

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres."),
    confirmar: z.string(),
  })
  .refine((datos) => datos.password === datos.confirmar, {
    path: ["confirmar"],
    message: "Las contraseñas no coinciden.",
  });

/** Estado devuelto por las server actions de perfil. */
export interface EstadoPerfil {
  ok?: boolean;
  error?: string;
  mensaje?: string;
}
