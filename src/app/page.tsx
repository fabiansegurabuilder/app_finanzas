import Link from "next/link";
import { ArrowRight, PieChart, Wallet, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const CARACTERISTICAS = [
  {
    icono: Wallet,
    titulo: "Registra en segundos",
    descripcion:
      "Añade ingresos y gastos con descripción, valor, fecha y categoría.",
  },
  {
    icono: PieChart,
    titulo: "Dashboard visual",
    descripcion:
      "Consulta tu saldo mensual y la distribución de gastos por categoría.",
  },
  {
    icono: ListChecks,
    titulo: "Filtra y exporta",
    descripcion:
      "Filtra por período y categoría, busca por descripción y exporta a CSV.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo href="/" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" render={<Link href="/login" />}>
            Iniciar sesión
          </Button>
          <Button render={<Link href="/registro" />}>Crear cuenta</Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-12 pb-16 text-center sm:px-6 sm:pt-20">
          <span className="border-border bg-accent text-accent-foreground rounded-full border px-3 py-1 text-xs font-medium">
            Tus finanzas, claras y bajo control
          </span>
          <h1 className="text-foreground mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Controla tus ingresos y gastos en un solo lugar
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg text-balance">
            Una app simple y visual para registrar tus movimientos, entender en
            qué gastas y planear mejor tu mes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/registro" />}>
              Empezar gratis
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/login" />}>
              Ya tengo cuenta
            </Button>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-20 sm:grid-cols-3 sm:px-6">
          {CARACTERISTICAS.map((caracteristica) => {
            const Icono = caracteristica.icono;
            return (
              <div
                key={caracteristica.titulo}
                className="border-border bg-card rounded-xl border p-6 text-left"
              >
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                  <Icono className="size-5" aria-hidden="true" />
                </div>
                <h2 className="text-card-foreground mt-4 text-base font-semibold">
                  {caracteristica.titulo}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {caracteristica.descripcion}
                </p>
              </div>
            );
          })}
        </section>
      </main>

      <footer className="border-border border-t">
        <div className="text-muted-foreground mx-auto w-full max-w-6xl px-4 py-6 text-center text-sm sm:px-6">
          App Finanzas Personales · Proyecto de clase
        </div>
      </footer>
    </div>
  );
}
