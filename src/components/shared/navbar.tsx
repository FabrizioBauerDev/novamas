"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { newChatNova } from "@/lib/utils";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleChatNavigation = () => {
    const chatId = newChatNova();
    router.push(`/chatNova/${chatId}`);
  };

  const handleChatNavigationMobile = () => {
    setIsOpen(false);
    const chatId = newChatNova();
    router.push(`/chatNova/${chatId}`);
  };

  const navigationLinks = [
    { href: "/", label: "Inicio" },
    { href: "/recursos", label: "Recursos" },
    { href: "/contacto", label: "Contacto" },
    { href: "/emergencia", label: "Líneas de Emergencia" },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y navegación principal */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">NoVa+</span>
            </Link>

            {/* Navegación desktop */}
            <div className="hidden md:flex space-x-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 rounded-md"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Botones de acción - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-md text-gray-700">
                  Bienvenida/o, <span className="font-medium">{user.name}</span>
                </span>
                <DropBoxUser handleChatNavigation={handleChatNavigation} />
              </>
            ) : (
              <>
                <Button
                  onClick={handleChatNavigation}
                  variant="outline"
                  className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chatea con NoVa+</span>
                </Button>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 hover:bg-gray-50"
                    aria-label="Iniciar sesión"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Menú móvil */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full h-full">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    Menú de navegación
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  {/* Logo en móvil */}
                  <div className="pb-4 border-b border-gray-200">
                    <span className="text-xl font-bold text-gray-900">
                      No va más
                    </span>
                  </div>

                  {/* Enlaces de navegación móvil */}
                  <div className="flex flex-col space-y-2">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium transition-colors duration-200 hover:bg-gray-50 rounded-md"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Botones de acción móvil */}
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <Button
                      onClick={handleChatNavigationMobile}
                      className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chatea con NoVa+</span>
                    </Button>

                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center space-x-2 border-gray-300 bg-transparent"
                      >
                        <User className="w-4 h-4" />
                        <span>Iniciar Sesión</span>
                      </Button>
                    </Link>
                  </div>

                  {/* Banner de emergencia móvil */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 font-semibold text-sm">
                        ¿Necesitas ayuda inmediata?
                      </p>
                      <p className="text-red-600 text-xs mt-1">
                        Línea Nacional Gratuita:{" "}
                        <a href="tel:141" className="underline font-semibold">
                          141
                        </a>
                        • Disponible 24/7 (orientación en adicciones).
                        <br />
                        En San Luis podés consultar en el Programa de Prevención
                        y Asistencia del Juego Patológico (Ministerio de Salud).
                      </p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
