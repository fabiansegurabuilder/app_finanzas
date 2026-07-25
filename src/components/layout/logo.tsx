import Link from "next/link";
import { Wallet } from "lucide-react";
import { NOMBRE_APP } from "@/lib/app-config";

/** Logotipo de la aplicación con enlace al inicio del área. */
export function Logo({ href = "/dashboard" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="text-foreground flex min-w-0 items-center gap-2 font-semibold"
    >
      <span className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
        <Wallet className="size-4" aria-hidden="true" />
      </span>
      <span className="truncate text-sm leading-tight tracking-tight sm:text-base">
        {NOMBRE_APP}
      </span>
    </Link>
  );
}
