import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { crearClienteServidor } from "@/lib/supabase/server";
import { SubirAvatar } from "@/features/perfil/components/subir-avatar";
import { FormularioPerfil } from "@/features/perfil/components/formulario-perfil";
import { FormularioPassword } from "@/features/perfil/components/formulario-password";

export const metadata: Metadata = {
  title: "Mi perfil",
};

export default async function PerfilPage() {
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "";
  const nombre = (user.user_metadata?.full_name as string | undefined) ?? "";
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  return (
    <>
      <PageHeader
        titulo="Mi perfil"
        descripcion="Administra tu información personal y la seguridad de tu cuenta."
      />

      <Card>
        <CardHeader>
          <CardTitle>Foto de perfil</CardTitle>
          <CardDescription>
            Usa una imagen cuadrada (máximo 2 MB).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubirAvatar
            userId={user.id}
            email={email}
            nombre={nombre}
            avatarUrl={avatarUrl}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
          <CardDescription>
            Tu nombre se muestra en la barra lateral y el menú.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormularioPerfil nombre={nombre} />
          <div className="space-y-2">
            <Label htmlFor="email-perfil">Correo electrónico</Label>
            <Input id="email-perfil" value={email} disabled readOnly />
            <p className="text-muted-foreground text-xs">
              El correo no se puede cambiar desde aquí.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
          <CardDescription>Cambia tu contraseña de acceso.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormularioPassword />
        </CardContent>
      </Card>
    </>
  );
}
