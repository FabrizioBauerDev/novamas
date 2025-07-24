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

interface DropboxUserProps {
  handleChatNavigation: () => void;
}

export default function DropboxUser({ handleChatNavigation }: DropboxUserProps) {
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
          <DropdownMenuItem className={menuItemClass}><Link href="/perfil">Perfil</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Acciones rápidas</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className={menuItemClass}><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
            <DropdownMenuItem className={menuItemClass}><Link href="/estadisticas">Estadísticas</Link></DropdownMenuItem>
            <DropdownMenuItem className={menuItemClass}><Link href="/sesion-grupal">Sesión Grupal</Link></DropdownMenuItem>
            <DropdownMenuItem className={menuItemClass}><Link href="/configuracion">Configuración</Link></DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>ChatNova+</DropdownMenuLabel>
          <DropdownMenuItem className={menuItemClass} onClick={handleChatNavigation}>Nuevo chat</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className={menuItemClass} onClick={handleSignOut}><LogOut className="w-5 h-5" />Cerrar sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
