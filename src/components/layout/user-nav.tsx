"use client";

import Link from "next/link";
import { ChevronsUpDown, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/layout/user-avatar";
import { cerrarSesion } from "@/features/auth/actions";

interface UserNavProps {
  email: string;
  nombre?: string;
  avatarUrl?: string;
}

/** Menú del usuario: perfil y cerrar sesión. */
export function UserNav({ email, nombre, avatarUrl }: UserNavProps) {
  const mostrar = nombre?.trim() || email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="hover:bg-accent flex w-full items-center gap-2 rounded-lg p-2 text-left transition-colors"
          />
        }
      >
        <UserAvatar nombre={nombre} email={email} avatarUrl={avatarUrl} />
        <span className="min-w-0 flex-1">
          <span className="text-foreground block truncate text-sm font-medium">
            {mostrar}
          </span>
          <span className="text-muted-foreground block truncate text-xs">
            {email}
          </span>
        </span>
        <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{mostrar}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/perfil" />}>
          <User className="size-4" />
          Mi perfil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => cerrarSesion()}>
          <LogOut className="size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
