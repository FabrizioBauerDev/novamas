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
import { handleSignOut } from "@/lib/actions";

export default function DropboxUser() {
  const menuItemClass = "hover:bg-gray-200 focus:bg-gray-200 data-[highlighted]:bg-gray-200";
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
          <Link href="/perfil"><DropdownMenuItem className={menuItemClass}>Perfil</DropdownMenuItem></Link>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Acciones rápidas</DropdownMenuLabel>
          <DropdownMenuGroup>
            <Link href="/dashboard"><DropdownMenuItem className={menuItemClass}>Dashboard</DropdownMenuItem></Link>
            <Link href="/estadisticas"><DropdownMenuItem className={menuItemClass}>Estadísticas</DropdownMenuItem></Link>
            <Link href="/sesion-grupal"><DropdownMenuItem className={menuItemClass}>Sesión Grupal</DropdownMenuItem></Link>
            <Link href="/configuracion"><DropdownMenuItem className={menuItemClass}>Configuración</DropdownMenuItem></Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>ChatNova+</DropdownMenuLabel>
          <Link href="/chatNova"><DropdownMenuItem className={menuItemClass}>Nuevo chat</DropdownMenuItem></Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem className={menuItemClass} onClick={handleSignOut}><LogOut className="w-5 h-5" />Cerrar sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
