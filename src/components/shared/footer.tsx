import Link from "next/link"

export default function Footer() {
  return (
      <footer className="relative bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 text-white overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                NoVa+
              </h3>
              <p className="text-gray-300 mb-4">
                Tu asistente virtual para abordar la temática de la adicción a las apuestas y juegos de azar online.
              </p>
              <div className="flex space-x-4">
                <Link
                    href="https://www.facebook.com/programauniversitariodeprevencionunsl"
                    target="_blank"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
                <Link
                    href="https://www.instagram.com/prevencionunsl"
                    target="_blank"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                    aria-label="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-300">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/chatNova" className="text-gray-300 hover:text-white transition-colors">
                    Chat con NoVa+
                  </Link>
                </li>
                <li>
                  <Link href="/nosotros" className="text-gray-300 hover:text-white transition-colors">
                    Quienes somos
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

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-purple-300">Recursos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/recursos" className="text-gray-300 hover:text-white transition-colors">
                    Material de Apoyo
                  </Link>
                </li>
                <li>
                  <Link href="/terminos" className="text-gray-300 hover:text-white transition-colors">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="text-gray-300 hover:text-white transition-colors">
                    Políticas de Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Emergency Banner */}
          <div className="border-t border-white/10 py-8">
            <div className="bg-red-950/50 backdrop-blur-sm border-2 border-red-500/50 rounded-xl p-6 shadow-xl shadow-red-900/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.636 0L3.178 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg mb-3">¿Necesitas ayuda profesional inmediata?</p>
                  <div className="space-y-2 text-red-100">
                    <p className="font-semibold">
                      📞 Línea Nacional Gratuita:{" "}
                      <a href="tel:141" className="underline hover:text-white transition-colors text-red-200 font-bold">
                        141
                      </a>{" "}
                      (24/7 - Orientación en adicciones)
                    </p>
                    <div className="text-sm space-y-1 pt-2 border-t border-red-400/30">
                      <p className="font-medium text-red-200">Recursos en San Luis:</p>
                      <p>• Centro de Prevención y Asistencia a las Adicciones (CPAA): 4452000 Int 4707/5160</p>
                      <p>• Hospital Salud Mental: 4452000 Int 5364</p>
                      <p>• CPAA Villa Mercedes: 4452000 Int 5400</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white/10 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p className="text-gray-400">Desarrollado por Luciana Loyola y Fabrizio Riera.</p>
              <p className="text-gray-400">© 2025 NoVa+. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
  )
}
