import Link from "next/link"
import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Inicio | NoVa+ Asistente Virtual",
  description:
      "NoVa+ tu asistente virtual para la prevención de problemáticas con las apuestas y juegos de azar. Comienza tu conversación con NoVa+ y accede a recursos de ayuda.",
  keywords: ["adicción", "juegos de azar", "apuestas online", "ludopatía", "prevención", "asistente virtual", "IA"],
  openGraph: {
    title: "NoVa+ | Tu asistente virtual para el juego responsable",
    description:
        "Tu asistente virtual para abordar la temática de la prevención de problemáticas con las apuestas y juegos de azar online.",
    type: "website",
  },
}

export default function Home() {
  return (
      <div className="min-h-screen bg-gray-50 relative">
      {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero section */}
          <div className="relative py-16 sm:py-20 overflow-hidden">
            <div className="text-center max-w-5xl mx-auto">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Bienvenido a
              </span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                NoVa+
              </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed text-pretty">
                Tu compañero de confianza en la prevención y el juego responsable. Un espacio seguro para obtener apoyo e
                información sobre adicción a las apuestas y juegos de azar online.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link
                    href="/chatNova"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white overflow-hidden rounded-2xl shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Comenzar chat con NoVa+
                </span>
                </Link>

                <Link
                    href="/recursos"
                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-all hover:scale-105"
                >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Explorar recursos
                </span>
                </Link>
              </div>

              {/* Logo header section integrated into design */}
              <div className="pt-2 pb-2 flex items-center justify-center gap-8">
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center transition-all group-hover:scale-105">
                    <a href="https://www.unsl.edu.ar/">
                      <Image
                          src="/logounsl-sinfondo.png"
                          alt="Universidad"
                          width={112}
                          height={112}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                      />
                    </a>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-indigo-300 to-transparent"></div>

                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center transition-all group-hover:scale-105">
                    <a href="http://www.prevencionenadicciones.unsl.edu.ar">
                      <Image
                          src="/prevencionunsl.png"
                          alt="Grupo de Prevención UNSL"
                          width={112}
                          height={112}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                      />
                    </a>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="pb-16">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Main intro card */}
              <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-indigo-100 shadow-md">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  ¿Qué es NoVa+?
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Somos un proyecto de la <strong>Universidad Nacional de San Luis</strong> que une tecnología y
                  psicología para abordar las problemáticas de las apuestas online y el juego patológico en jóvenes y
                  adolescentes.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Desarrollado por Ing. Luciana Loyola e Ing. Fabrizio Riera.
                </p>

              </div>

              {/* Contact footer */}
              <div className="text-center bg-white/40 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-200">
                <p className="text-sm text-gray-600">
                  ¿Querés saber más?{" "}
                  <a
                      href="mailto:programa.adicciones.unsl1@gmail.com"
                      className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Contactanos
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
