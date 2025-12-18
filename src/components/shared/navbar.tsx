"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Menu, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import DropBoxUser from "@/components/shared/dropboxuser";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
}

export default function Navbar({ user: initialUser }: NavbarProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  
  // Si la sesión está cargando, usar los datos iniciales del servidor
  // Si la sesión está autenticada, usar los datos de la sesión
  // Si la sesión no está autenticada o expiró, no mostrar usuario
  const user = status === "loading" 
    ? initialUser 
    : (session?.user && status === "authenticated" ? session.user : null);

  const navigationLinks = [
    { href: "/", label: "Inicio" },
    { href: "/recursos", label: "Recursos" },
    { href: "/emergencia", label: "Líneas de Emergencia" },
    { href: "/nosotros", label: "Quiénes somos" },
  ];

  return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 🔹 Contenedor principal */}
          <div className="relative flex h-16 items-center justify-between">

            {/* 🔹 Izquierda (placeholder para balancear en mobile) */}
            <div className="md:hidden w-10" />

            {/* 🔹 Logo centrado en mobile */}
            <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
              <Link href="/" className="flex items-center gap-3">
                <Image
                    src="/logo_novita.png"
                    alt="NoVa+"
                    width={40}
                    height={40}
                    className="w-9 h-9 object-contain"
                    priority
                />
                <span className="text-xl font-semibold text-gray-900 tracking-tight">
                NoVa+
              </span>
              </Link>
            </div>

            {/* 🔹 Navegación desktop */}
            <div className="hidden md:flex items-center space-x-6 ml-8">
              {navigationLinks.map((link) => (
                  <Link
                      key={link.href}
                      href={link.href}
                      className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md transition-colors hover:bg-gray-100 hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
              ))}
            </div>

            {/* 🔹 Acciones desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                  <>
                <span className="text-sm text-gray-700">
                  Bienvenida/o,{" "}
                  <span className="font-medium">{user.name}</span>
                </span>
                    <DropBoxUser user={user} />
                  </>
              ) : (
                  <>
                    <Link href="/chatNova">
                      <Button
                          variant="outline"
                          className="flex items-center gap-2 border-gray-300 text-gray-700 bg-transparent hover:bg-gray-100"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chatea con NoVa+
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-700 hover:bg-gray-100"
                          aria-label="Iniciar sesión"
                      >
                        <User className="w-5 h-5" />
                      </Button>
                    </Link>
                  </>
              )}
            </div>

            {/* 🔹 Menú mobile */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-700">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-full h-full overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      Menú de navegación
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col space-y-4 mt-4">
                    {/* Logo mobile */}
                    <div className="flex justify-center border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-3">
                        <Image
                            src="/logo_novita.png"
                            alt="NoVa+"
                            width={36}
                            height={36}
                            className="w-8 h-8 object-contain"
                        />
                        <span className="text-lg font-semibold text-gray-900">
                        NoVa+
                      </span>
                      </div>
                    </div>

                    {user && (
                        <div className="text-center text-sm text-gray-700">
                          Bienvenida/o,{" "}
                          <span className="font-medium">{user.name}</span>
                        </div>
                    )}

                    <div className="flex flex-col space-y-2">
                      {navigationLinks.map((link) => (
                          <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className="px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
                          >
                            {link.label}
                          </Link>
                      ))}
                    </div>

                    {user ? (
                        <div className="pt-4 border-t border-gray-200 space-y-2">
                          <Link href="/chatNova" onClick={() => setIsOpen(false)}>
                            Nuevo chat
                          </Link>

                          {user.role === "ADMINISTRADOR" && (
                              <Link
                                  href="/usermanagement"
                                  onClick={() => setIsOpen(false)}
                              >
                                Gestión de usuarios
                              </Link>
                          )}

                          <button
                              onClick={() => {
                                setIsOpen(false);
                                signOut({ callbackUrl: "/" });
                              }}
                              className="text-left"
                          >
                            Cerrar sesión
                          </button>
                        </div>
                    ) : (
                        <div className="pt-4 border-t border-gray-200 space-y-3">
                          <Link href="/chatNova" onClick={() => setIsOpen(false)}>
                            <Button className="w-full flex gap-2">
                              <MessageCircle className="w-4 h-4" />
                              Chatea con NoVa+
                            </Button>
                          </Link>
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full flex gap-2">
                              <User className="w-4 h-4" />
                              Iniciar sesión
                            </Button>
                          </Link>
                        </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
  );
}
