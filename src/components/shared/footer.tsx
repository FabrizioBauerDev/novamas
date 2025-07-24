"use client";

import { newChatNova } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Footer() {

  const router = useRouter();

  const handleChatNavigation = () => {
    const chatId = newChatNova();
    router.push(`/chatNova/${chatId}`);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">No va más</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Tu asistente virtual para abordar la temática de la adicción a las apuestas y juegos de azar online.
              Estamos aquí para ayudarte en cada paso.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/programauniversitariodeprevencionunsl"  target="_blank" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link href="https://www.instagram.com/prevencionunsl" target="_blank" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <a href="#" onClick={handleChatNavigation} className="text-gray-300 hover:text-white transition-colors">
                  Chat con NoVa+
                </a>
              </li>
              <li>
                <Link href="/recursos" className="text-gray-300 hover:text-white transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <Link
                  href="http://www.prevencionenadicciones.unsl.edu.ar/"
                  className="text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Prevención UNSL
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/emergencia" className="text-gray-300 hover:text-white transition-colors">
                  Líneas de Emergencia
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-300 hover:text-white transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="border-t border-gray-700 py-6">
          <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.636 0L3.178 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <p className="text-white font-semibold">¿Necesitas ayuda inmediata?</p>
                <p className="text-red-200 text-sm">
                  Línea Nacional Gratuita:{" "}
                  <a href="tel:141" className="underline font-semibold">
                    141
                  </a>
                  • Disponible 24/7 (orientación en adicciones).
                  <br/>En San Luis podés consultar en el Programa de Prevención y Asistencia del Juego Patológico (Ministerio de Salud).
                </p>
                
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">Desarrollado por Luciana Loyola y Fabrizio Riera.</p>
            <p className="text-gray-400 text-sm">© 2025 No va más. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terminos" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos de Uso
              </Link>
              <Link href="/privacidad" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacidad
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
