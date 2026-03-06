import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Quiénes Somos?",
  description: "Conocé al equipo multidisciplinario detrás del Asistente Virtual",
};

export default function AboutUsPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Quiénes Somos?
            </h1>
            <p className="text-lg text-gray-600">
              Un equipo multidisciplinario que busca generar desde la
              universidad un aporte socialmente valioso
            </p>
          </div>

          {/* Contenido */}
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            {/* Introducción */}
            <section>
              <p className="text-gray-700 leading-relaxed mb-4">
                Somos un proyecto nacido de la colaboración entre dos mundos: 
                la tecnología y la psicología. Un
                equipo multidisciplinario de la{" "}
                <strong>Universidad Nacional de San Luis</strong> que cree
                firmemente en el poder de la inteligencia artificial para
                generar un impacto social positivo.
              </p>
            </section>

            {/* Nuestra Misión */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Nuestra Misión
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Trabajamos para abordar una problemática que afecta cada vez más
                a jóvenes y adolescentes:{" "}
                <strong>las apuestas online y el juego patológico</strong>. A
                través de nuestro asistente conversacional basado en
                inteligencia artificial, buscamos:
              </p>
              <div className="space-y-3 ml-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💬</span>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Brindar contención y acompañamiento</strong> a
                    quienes lo necesiten
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Promover el juego responsable</strong> y la
                    prevención
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🤝</span>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Ofrecer recursos de ayuda</strong> conectando con
                    centros de atención
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Generar conocimiento científico</strong> sobre
                    intervenciones conversacionales con IA
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                Creemos que desde la universidad podemos generar aportes a la
                sociedad, especialmente para problemáticas actuales que afectan
                a nuestra comunidad y que aún no se abordan de forma masiva e
                institucional.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Un Proyecto de 2 Facultades
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Este Asistente Virtual es el resultado del trabajo entre dos facultades de la
                UNSL, para crear una herramienta técnicamente correcta con
                solidez de área de psicología:
              </p>

              <div className="space-y-6">
                {/* Facultad FCFMyN */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🖥️</span>
                    Facultad de Ciencias Físico Matemáticas y Naturales
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Directoras del Desarrollo:
                      </p>
                      <ul className="list-disc list-inside ml-4">
                        <li>Lorena Baigorria</li>
                        <li>Ana Garis</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Desarrolladores:
                      </p>
                      <ul className="list-disc list-inside ml-4">
                        <li>Luciana Loyola</li>
                        <li>Fabrizio Riera Bauer</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Facultad de Psicología */}
                <div className="bg-purple-100 p-6 rounded-lg border border-purple-300">
                  <h3 className="text-xl font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🧠</span>
                    Facultad de Psicología
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Directora de Investigación:
                      </p>
                      <ul className="list-disc list-inside ml-4">
                        <li>Eliana González</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Investigadores:
                      </p>
                      <ul className="list-disc list-inside ml-4">
                        <li>Sergio Fernández</li>
                        <li>Nehuen Herrera</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* El Origen del Proyecto */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                El Origen del Proyecto
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Tiene un doble valor académico:
              </p>
              <div className="space-y-4 ml-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎓</span>
                  <p className="text-gray-700 leading-relaxed">
                    Constituye el{" "}
                    <strong>
                      Proyecto Final Integrador de Ingeniería en Informática
                    </strong>{" "}
                    de los desarrolladores Luciana y Fabrizio, para finalizar su
                    formación académica.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔬</span>
                  <p className="text-gray-700 leading-relaxed">
                    Forma parte del proyecto de investigación{" "}
                    <strong>
                      &quot;Evaluación de la Efectividad y Aceptación de un
                      Asistente Virtual Basado en Inteligencia Artificial para
                      la Prevención de la Adicción al Juego Online en
                      Adolescentes&quot;
                    </strong>{" "}
                    de la Facultad de Psicología dirigido por Eliana, del cual
                    participan Sergio y Nehuen.
                  </p>
                </div>
              </div>
            </section>
            {/* Impacto */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Impacto
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                La idea y el proyecto ha tenido su impacto formando
                parte de charlas y publicaciones en congresos donde hemos
                compartido nuestra experiencia, como en:
              </p>
              <div className="space-y-3 ml-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>
                      Tercera edición de la Jornada Salud y Consumos en la Vida
                      Universitaria
                    </strong>{" "}
                    - UNSL
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Congreso de Salud Mental</strong> - Mendoza 2025
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>
                      Congreso Nacional de Ingeniería Informática / Sistemas de
                      Información
                    </strong>{" "}
                    - Córdoba 2025
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                Cada presentación nos permite visibilizar esta problemática y
                demostrar cómo la tecnología puede ser aliada de la salud
                mental.
              </p>
            </section>

            {/* ¿Por Qué? */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ¿Por Qué?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Las apuestas online representan una problemática en constante
                crecimiento, especialmente entre jóvenes. La facilidad de
                acceso, la normalización del juego y la falta de regulación
                efectiva crean un escenario de riesgo para miles de
                adolescentes.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Este Asistente Virtual nace como una respuesta accesible, inmediata y sin juicio,
                pensada especialmente para quienes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  Están empezando a preguntarse si su relación con el juego es
                  saludable
                </li>
                <li>Buscan información sin temor a ser juzgados</li>
                <li>Necesitan un primer paso antes de hablar con alguien</li>
                <li>Quieren herramientas para jugar de forma responsable</li>
              </ul>
            </section>

            {/* Nuestro Compromiso */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Nuestro Compromiso
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Como equipo universitario, nos comprometemos a brindar:
              </p>
              <div className="space-y-1 ml-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">✨</span>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Privacidad y protección de datos</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">✨</span>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Transparencia</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">✨</span>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Base científica</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">✨</span>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Mejora continua</strong>
                  </p>
                </div>
              </div>
            </section>

            {/* Agradecimiento */}
            <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                Agradecimiento
              </h2>
              <p className="text-blue-800 leading-relaxed mb-4">
                <strong>Gracias por estar aquí.</strong> Tu participación no
                solo te ayuda a ti, sino que contribuye a una investigación social de la universidad.
              </p>
              <p className="text-blue-800 leading-relaxed">
                Esperamos que este Asistente Virtual sea una herramienta útil y que podamos
                aportar para enfrentar esta problemática social tan importante.
              </p>
            </section>

            {/* Contacto */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">📧</span>
                ¿Querés saber más o contactarnos?
              </h2>
              <div className="text-gray-700 space-y-1">
                <p>
                  <strong>Universidad Nacional de San Luis</strong>
                </p>
                <p>Proyecto</p>
                <p>
                  <strong>Email:</strong> <a href="mailto:programa.adicciones.unsl1@gmail.com">programa.adicciones.unsl1@gmail.com</a>
                </p>
              </div>
            </section>

            {/* Footer */}
            <section className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Desarrollado con 💙 en San Luis, Argentina
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Universidad Nacional de San Luis
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
