import Link from "next/link";

export default function Home() {
  return (
    // min-h-[calc(100vh-4rem)] para que tenga en cuenta la altura del navbar (64px = 4rem)
    <div className="flex flex-col">
      {/* Contenido principal */}
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Bienvenido a No va más</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Tu asistente virtual para abordar la temática de la adicción a las apuestas y juegos de azar online.
              Estamos aquí para ayudarte en cada paso.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link
                href="/chatNova"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                Comenzar Chat con NoVa+
              </Link>
              <Link
                href="/recursos"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Ver Recursos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}