import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/** Calcula las iniciales a partir del nombre o el correo. */
export function iniciales(nombre: string | undefined, email: string): string {
  const base = nombre?.trim() || email;
  const partes = base.split(/\s+/).filter(Boolean);
  if (partes.length >= 2) {
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }
  return base.slice(0, 2).toUpperCase();
}

interface UserAvatarProps {
  nombre?: string;
  email: string;
  avatarUrl?: string;
  size?: "default" | "sm" | "lg";
  className?: string;
}

/** Avatar del usuario: muestra la foto o sus iniciales como respaldo. */
export function UserAvatar({
  nombre,
  email,
  avatarUrl,
  size = "default",
  className,
}: UserAvatarProps) {
  return (
    <Avatar size={size} className={cn(className)}>
      {avatarUrl ? <AvatarImage src={avatarUrl} alt={nombre ?? email} /> : null}
      <AvatarFallback className="bg-primary/10 text-primary font-medium">
        {iniciales(nombre, email)}
      </AvatarFallback>
    </Avatar>
  );
}
