"use client";

import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface DropboxUserProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
}
export default function DropboxUser({ user: initialUser }: DropboxUserProps) {
  const { data: session, status } = useSession();
  
  // Si la sesión está cargando, usar los datos iniciales del servidor
  // Si la sesión está autenticada, usar los datos de la sesión
  // Si la sesión no está autenticada o expiró, no mostrar usuario
  const user = status === "loading" 
    ? initialUser 
    : (session?.user && status === "authenticated" ? session.user : null);
  
  const menuItemClass = "hover:bg-gray-200 focus:bg-gray-200 data-[highlighted]:bg-gray-200";
  
  // Si no hay usuario, no renderizar el componente
  if (!user) return null;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="text-gray-700 hover:bg-gray-200"
            aria-label="Iniciar sesión"
          >
            <User className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
          <Link href="/profile"><DropdownMenuItem className={menuItemClass}>Perfil</DropdownMenuItem></Link>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Acciones rápidas</DropdownMenuLabel>
          <DropdownMenuGroup>
            <Link href="/dashboard"><DropdownMenuItem className={menuItemClass}>Dashboard</DropdownMenuItem></Link>
            <Link href="/statistics"><DropdownMenuItem className={menuItemClass}>Estadísticas</DropdownMenuItem></Link>
            <Link href="/chatgroup"><DropdownMenuItem className={menuItemClass}>Sesión Grupal</DropdownMenuItem></Link>
            {(user?.role === "ADMINISTRADOR" && (
                <Link href="/usermanagement"><DropdownMenuItem className={menuItemClass}>Gestión de usuarios</DropdownMenuItem></Link>))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>ChatNova+</DropdownMenuLabel>
          <Link href="/chatNova"><DropdownMenuItem className={menuItemClass}>Nuevo chat</DropdownMenuItem></Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem className={menuItemClass} onClick={() => signOut({ callbackUrl: "/" })}><LogOut className="w-5 h-5" />Cerrar sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
