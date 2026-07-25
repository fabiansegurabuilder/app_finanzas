import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthForm } from "@/features/auth/components/auth-form";
import { iniciarSesion } from "@/features/auth/actions";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Iniciar sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a tus finanzas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AuthForm
          accion={iniciarSesion}
          textoBoton="Entrar"
          redirectTo={redirect}
        />
        <p className="text-muted-foreground text-center text-sm">
          ¿No tienes cuenta?{" "}
          <Link
            href="/registro"
            className="text-primary font-medium hover:underline"
          >
            Crea una
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
