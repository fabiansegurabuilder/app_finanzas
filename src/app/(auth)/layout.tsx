import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";

/** Layout centrado para las pantallas de autenticación. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-6xl px-4 py-5 sm:px-6">
        <Logo href="/" />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">{children}</div>
      </main>
      <footer className="text-muted-foreground py-6 text-center text-sm">
        <Link href="/" className="hover:text-foreground">
          Volver al inicio
        </Link>
      </footer>
    </div>
  );
}
