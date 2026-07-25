import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cerrarSesion } from "@/features/auth/actions";

/** Muestra el usuario actual y permite cerrar sesión. */
export function UserNav({ email }: { email: string }) {
  const iniciales = email.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
        {iniciales}
      </div>
      <p
        className="text-foreground min-w-0 flex-1 truncate text-sm font-medium"
        title={email}
      >
        {email}
      </p>
      <form action={cerrarSesion}>
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut className="size-4" />
        </Button>
      </form>
    </div>
  );
}
