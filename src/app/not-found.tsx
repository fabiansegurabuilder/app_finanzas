import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Página 404 global. */
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-primary text-sm font-medium">Error 404</p>
      <h1 className="text-foreground text-3xl font-bold tracking-tight">
        Página no encontrada
      </h1>
      <p className="text-muted-foreground max-w-md">
        La página que buscas no existe o fue movida.
      </p>
      <Button render={<Link href="/" />}>Volver al inicio</Button>
    </main>
  );
}
