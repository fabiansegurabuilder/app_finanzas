import Link from "next/link";
import { Wallet } from "lucide-react";

/** Logotipo de la aplicación con enlace al inicio del área. */
export function Logo({ href = "/dashboard" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="text-foreground flex items-center gap-2 font-semibold"
    >
      <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
        <Wallet className="size-4" aria-hidden="true" />
      </span>
      <span className="text-base tracking-tight">Finanzas</span>
    </Link>
  );
}
