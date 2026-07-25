"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/layout/user-avatar";
import { crearClienteNavegador } from "@/lib/supabase/client";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

interface SubirAvatarProps {
  userId: string;
  email: string;
  nombre?: string;
  avatarUrl?: string;
}

export function SubirAvatar({
  userId,
  email,
  nombre,
  avatarUrl,
}: SubirAvatarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);

  async function alSeleccionar(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];
    evento.target.value = ""; // permite volver a elegir el mismo archivo
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      toast.error("Selecciona un archivo de imagen.");
      return;
    }
    if (archivo.size > MAX_BYTES) {
      toast.error("La imagen supera el límite de 2 MB.");
      return;
    }

    setSubiendo(true);
    try {
      const supabase = crearClienteNavegador();
      const extension = archivo.name.split(".").pop() || "png";
      const ruta = `${userId}/avatar.${extension}`;

      const { error: errorSubida } = await supabase.storage
        .from("avatars")
        .upload(ruta, archivo, { upsert: true, cacheControl: "3600" });
      if (errorSubida) throw errorSubida;

      const { data } = supabase.storage.from("avatars").getPublicUrl(ruta);
      // Se agrega un parámetro para evitar la caché del navegador.
      const urlPublica = `${data.publicUrl}?t=${Date.now()}`;

      const { error: errorPerfil } = await supabase.auth.updateUser({
        data: { avatar_url: urlPublica },
      });
      if (errorPerfil) throw errorPerfil;

      toast.success("Foto de perfil actualizada.");
      router.refresh();
    } catch {
      toast.error("No se pudo actualizar la foto.");
    } finally {
      setSubiendo(false);
    }
  }

  async function eliminarFoto() {
    setSubiendo(true);
    try {
      const supabase = crearClienteNavegador();
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: null },
      });
      if (error) throw error;
      toast.success("Foto eliminada.");
      router.refresh();
    } catch {
      toast.error("No se pudo eliminar la foto.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <UserAvatar
        nombre={nombre}
        email={email}
        avatarUrl={avatarUrl}
        size="lg"
        className="size-16"
      />
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={alSeleccionar}
        />
        <Button
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={subiendo}
        >
          {subiendo ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Camera className="size-4" />
          )}
          Cambiar foto
        </Button>
        {avatarUrl ? (
          <Button
            variant="ghost"
            onClick={eliminarFoto}
            disabled={subiendo}
            aria-label="Eliminar foto"
          >
            <Trash2 className="size-4" />
            Quitar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
