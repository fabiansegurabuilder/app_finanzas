"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLinks } from "@/components/layout/nav-links";
import { Logo } from "@/components/layout/logo";
import { UserNav } from "@/components/layout/user-nav";

/** Menú de navegación para pantallas pequeñas (se abre en un panel lateral). */
export function MobileNav({ email }: { email: string }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir menú de navegación"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 flex-col p-0">
        <SheetHeader className="border-border border-b p-4">
          <SheetTitle className="text-left">
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 p-3">
          <NavLinks onNavegar={() => setAbierto(false)} />
        </div>
        <div className="border-border border-t p-4">
          <UserNav email={email} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
