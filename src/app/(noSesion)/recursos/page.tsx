import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Recursos',
  description: 'Recursos y juego responsable',
};


export default function RecursosPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Recursos de Juego Responsable
            </h1>
            <p className="text-lg text-gray-600">
              Tips y estrategias para mantener el juego como entretenimiento
            </p>
          </div>

          {/* Contenido */}
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            {/* Introducción */}
            <section>
              <p className="text-gray-700 leading-relaxed mb-4">
                Los juegos de apuesta pueden ser una forma de entretenimiento
                siempre y cuando se puedan establecer y respetar ciertos
                límites. A continuación, te mostramos algunos{" "}
                <strong>tips y estrategias simples</strong> que pueden ayudarte
                a manejar tu comportamiento de juego de manera responsable.
              </p>
            </section>

            {/* Tips */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Tips para Jugar Responsablemente
              </h2>
              
              <div className="space-y-4">
                {/* Tip 1 */}
                <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎮</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Entretenimiento, no inversión
                      </h3>
                      <p className="text-gray-700">
                        Pensá en el juego como entretenimiento, no como una
                        manera de ganar dinero.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tip 2 */}
                <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Jugá acompañado
                      </h3>
                      <p className="text-gray-700">
                        Jugá habitualmente acompañado de amigos o familiares.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tip 3 */}
                <div className="bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-500">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💰</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Establecé límites de dinero
                      </h3>
                      <p className="text-gray-700">
                        Antes de empezar, establecé un límite de dinero. No
                        pidas dinero prestado.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tip 4 */}
                <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Controlá el tiempo
                      </h3>
                      <p className="text-gray-700">
                        Asegurate de establecer un período de tiempo limitado
                        para jugar.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tip 5 */}
                <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🚫</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        No intentes recuperar pérdidas
                      </h3>
                      <p className="text-gray-700">
                        No caigas en la trampa de intentar recuperar las
                        pérdidas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tip 6 */}
                <div className="bg-indigo-50 p-5 rounded-lg border-l-4 border-indigo-500">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">😌</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Evitá jugar en crisis emocionales
                      </h3>
                      <p className="text-gray-700">
                        Evitá jugar en tiempos de crisis emocionales, ya que
                        disminuye el autocontrol.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tip 7 */}
                <div className="bg-pink-50 p-5 rounded-lg border-l-4 border-pink-500">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚖️</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Equilibrá con otras actividades
                      </h3>
                      <p className="text-gray-700">
                        Equilibrá el juego con otras actividades de ocio o
                        entretenimiento.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tip 8 */}
                <div className="bg-teal-50 p-5 rounded-lg border-l-4 border-teal-500">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Dejá las tarjetas en casa
                      </h3>
                      <p className="text-gray-700">
                        Dejá las tarjetas bancarias en casa para no romper los
                        límites establecidos.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tip 9 */}
                <div className="bg-orange-50 p-5 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">☕</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Tomá descansos frecuentes
                      </h3>
                      <p className="text-gray-700">
                        Tomá descansos frecuentes para evaluar y tomar
                        perspectiva de tu juego.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tip 10 */}
                <div className="bg-rose-50 p-5 rounded-lg border-l-4 border-rose-500">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🍺</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        No bebas ni consumas drogas
                      </h3>
                      <p className="text-gray-700">
                        No bebas ni consumas drogas durante el juego, ya que
                        puede generar problemas para tomar decisiones sensatas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Recordatorio Importante */}
            <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                Recordá
              </h2>
              <p className="text-blue-800 leading-relaxed">
                Estos tips son herramientas simples pero efectivas para
                mantener una relación saludable con el juego. Si sentís que
                necesitás ayuda adicional, no dudes en{" "}
                <strong>buscar apoyo profesional</strong>.
              </p>
            </section>

            {/* Fuente */}
            <section className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Fuente:{" "}
                <a
                  href="https://www.saberjugar.gob.ar/?page=tips-JR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Saber Jugar - Lotería de la Ciudad de Buenos Aires
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}