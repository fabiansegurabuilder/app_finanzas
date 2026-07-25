import { z } from "zod";

export const credencialesSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio.")
    .email("Ingresa un correo válido."),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export type Credenciales = z.infer<typeof credencialesSchema>;

/** Estado compartido por los formularios de autenticación. */
export interface EstadoAuth {
  error?: string;
  mensaje?: string;
}
