import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos de NoVa+',
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Encabezado */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Políticas de Privacidad - NoVa+
            </h1>
            <p className="text-lg text-gray-600">
              Última actualización: 14 de Octubre de 2025
            </p>
          </div>

          {/* Contenido */}
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            {/* 1. Información General */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Información General
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                NoVa+ es una plataforma de investigación científica desarrollada en la <strong>Universidad Nacional de San Luis</strong>, por un equipo multidisciplinario de la <strong>Facultad de Ciencias Físico Matemáticas y Naturales</strong> y la <strong>Facultad de Psicología</strong>, como proyecto final integrador de ingeniería en informática enmarcado como herramienta para el proyecto de investigación:
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 italic">
                &quot;Evaluación de la Efectividad y Aceptación de un Asistente Virtual Basado en Inteligencia Artificial para la Prevención de la Adicción al Juego Online en Adolescentes&quot;
              </p>
              <div className="mt-4">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Responsable del Tratamiento de Datos
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Equipo de Investigación del Proyecto</strong><br />
                  Universidad Nacional de San Luis - Facultad de Psicología<br />
                  <strong>Responsable:</strong> [Nombre de la Directora del Proyecto]<br />
                  <strong>Correo electrónico:</strong> [correo electrónico a completar]
                </p>
              </div>
            </section>

            {/* 2. Compromiso con la Privacidad */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Compromiso con la Privacidad
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                En NoVa+ adoptamos los principios de <strong>Privacidad por Diseño y por Defecto</strong>, lo que significa que:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Solo recopilamos y procesamos datos personales <strong>estrictamente necesarios</strong> para los fines de investigación científica.</li>
                <li>Implementamos medidas técnicas y organizativas para proteger tu información <strong>desde el momento de su recolección</strong>.</li>
                <li>Minimizamos la cantidad de datos procesados al <strong>mínimo indispensable</strong>.</li>
                <li>Garantizamos que el uso de datos se realiza únicamente con tu <strong>consentimiento libre, expreso e informado</strong>.</li>
                <li>Aplicamos los principios de <strong>Minimización y Calidad de los Datos</strong> y <strong>Licitud y Consentimiento</strong>.</li>
              </ul>
            </section>

            {/* 3. Consentimiento Informado */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Consentimiento Informado
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                El uso de NoVa+ requiere tu <strong>consentimiento explícito</strong>, el cual será solicitado <strong>antes de acceder al asistente conversacional</strong>, mediante la aceptación de un checkbox en el formulario de <strong>Evaluación de Hábitos de Juego</strong> que indica:
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 italic">
                &quot;Acepto los Términos y Condiciones y las Políticas de Privacidad&quot;
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 font-semibold">
                Sin este consentimiento NO podrás utilizar el chatbot.
              </p>
              <div className="mt-4">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Requisitos de Edad
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>Edad mínima:</strong> 13 años.</li>
                  <li><strong>Usuarios entre 13 y 17 años:</strong> Deben contar con la autorización expresa de sus padres o tutores legales para participar en una conversación.</li>
                  <li><strong>Usuarios mayores de 18 años:</strong> Pueden participar sin autorización adicional.</li>
                </ul>
              </div>
            </section>

            {/* 4. Finalidad del Tratamiento de Datos */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Finalidad del Tratamiento de Datos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Los datos personales que recopilamos se utilizan exclusivamente para:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Analizar de manera científica y psicológica</strong> los hábitos de juego online y los factores de riesgo asociados al consumo abusivo o la ludopatía.</li>
                <li><strong>Evaluar la efectividad, aceptación y utilidad</strong> del asistente virtual en las intervenciones conversacionales proporcionadas.</li>
                <li><strong>Analizar patrones de comportamiento</strong> de jóvenes en interacciones con el asistente conversacional.</li>
                <li><strong>Realizar investigación científica</strong> en el campo de la prevención de adicciones al juego online.</li>
                <li><strong>Publicar resultados académicos</strong> (papers, congresos, informes) en formato <strong>completamente anónimo y agregado</strong>, sin posibilidad de identificación individual.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                <strong>En ningún caso</strong> los datos personales serán utilizados con fines comerciales, publicitarios ni compartidos con terceros ajenos al proyecto de investigación.
              </p>
            </section>

            {/* 5. Datos que Recopilamos */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Datos que Recopilamos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conforme al principio de <strong>minimización de datos</strong>, recolectamos únicamente la información necesaria para cumplir con los fines de investigación:
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    5.1 Datos Proporcionados Directamente por el Usuario
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    A través del formulario de <strong>Evaluación de Hábitos de Juego</strong> y otros formularios, recopilamos:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Edad</strong></li>
                    <li><strong>Sexo</strong></li>
                    <li><strong>Ubicación geográfica</strong> (barrio si se acepta geolocalización, o ciudad basada en IP)</li>
                    <li><strong>Niveles de exposición a las apuestas</strong> (información sobre hábitos de juego)</li>
                    <li><strong>Respuestas al formulario de evaluación</strong></li>
                    <li><strong>Retroalimentación de experiencia del usuario</strong> (valoración sobre la utilidad del chat)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    5.2 Datos Generados Automáticamente
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Durante tu interacción con el asistente conversacional, recopilamos:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Contenido de los mensajes</strong> enviados al chatbot</li>
                    <li><strong>Estadísticas de uso:</strong> número de mensajes, cantidad de palabras, duración de las conversaciones</li>
                    <li><strong>Análisis de sentimiento:</strong> valoraciones sobre emociones expresadas durante las conversaciones (realizado mediante procesamiento automatizado y tratado de forma <strong>anónima</strong>)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    5.3 Datos Técnicos
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Para el correcto funcionamiento de la plataforma, recopilamos datos técnicos que incluyen:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Dirección IP</strong></li>
                    <li><strong>Sistema operativo</strong></li>
                    <li><strong>Tipo de navegador</strong></li>
                    <li><strong>Tipo de dispositivo</strong> (móvil o escritorio)</li>
                    <li><strong>Datos analíticos de Vercel</strong> (proveedor de hosting y métricas técnicas anónimas sobre el uso de la web)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 6. Base Legal del Tratamiento */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Base Legal del Tratamiento
              </h2>
              <p className="text-gray-700 leading-relaxed">
                El tratamiento de los datos personales se fundamenta en:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li>El <strong>consentimiento libre, informado y expreso</strong> del usuario, otorgado mediante la aceptación previa del formulario <strong>&quot;Evaluación de Hábitos de Juego&quot;</strong>, requisito indispensable para el uso del asistente.</li>
                <li>La <strong>finalidad de investigación científica</strong> en el ámbito académico, conforme a las normativas de protección de datos aplicables.</li>
              </ul>
            </section>

            {/* 7. Cómo Almacenamos y Protegemos tus Datos */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Cómo Almacenamos y Protegemos tus Datos
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    7.1 Almacenamiento
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Los datos se almacenan en entornos seguros bajo estándares internacionales de protección:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Aplicación web:</strong> Servidores en la nube de <strong>Vercel</strong></li>
                    <li><strong>Base de datos:</strong> <strong>Neon</strong> (PostgreSQL en la nube)</li>
                    <li><strong>Procesamiento de estadísticas:</strong> Servidor local de la Universidad Nacional de San Luis</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    7.2 Medidas de Seguridad
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Implementamos robustas medidas de seguridad técnicas y organizativas para proteger tus datos:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Cifrado en tránsito:</strong> Utilizamos protocolos <strong>HTTPS/TLS</strong> en todas las comunicaciones para proteger los datos durante su transmisión.</li>
                    <li><strong>Cifrado en reposo:</strong> Los mensajes se almacenan cifrados mediante el algoritmo <strong>AES-256-GCM</strong>, un estándar de seguridad de nivel militar.</li>
                    <li><strong>Control de acceso:</strong> Solo el administrador del sistema y los investigadores autorizados con credenciales específicas tienen acceso a los datos.</li>
                    <li><strong>Políticas de acceso restringido:</strong> Se aplican políticas estrictas de gestión de contraseñas seguras y acceso limitado por roles dentro del equipo de investigación.</li>
                    <li><strong>Supervisión continua:</strong> Monitoreo constante de la infraestructura tecnológica.</li>
                    <li><strong>Eliminación periódica:</strong> Borrado automático de información sensible según los plazos establecidos.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    7.3 Servicios de Terceros
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Para el funcionamiento del asistente conversacional, utilizamos los siguientes servicios externos:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Google Generative AI (API de Gemini):</strong> Modelo de lenguaje que procesa las conversaciones de manera automática. Los datos enviados a Gemini se procesan de acuerdo con sus estándares de seguridad y privacidad, sin vincularse con información personal identificable.</li>
                    <li><strong>Vercel Analytics:</strong> Métricas técnicas anónimas sobre el uso de la plataforma.</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    El uso de estos servicios está sujeto a las políticas de privacidad de sus respectivos proveedores. El Proyecto <strong>no comparte datos personales identificables con terceros</strong> ajenos a la investigación.
                  </p>
                </div>
              </div>
            </section>

            {/* 8. Tiempo de Conservación de los Datos */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Tiempo de Conservación de los Datos
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    8.1 Mensajes del Chat
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Los <strong>mensajes completos</strong> enviados al asistente conversacional se conservan durante un período de <strong>30 días</strong> desde su envío. Transcurrido este plazo, <strong>se eliminan automáticamente</strong> de nuestros sistemas.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    8.2 Estadísticas Anónimas
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Las <strong>estadísticas agregadas y completamente anónimas</strong> derivadas de las conversaciones (sin contenido textual identificable) se conservan <strong>indefinidamente</strong> para fines de investigación científica, histórica y estadística.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Estas estadísticas NO permiten la identificación de usuarios individuales.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    8.3 Datos del Formulario
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Los datos demográficos y de hábitos de juego recopilados en los formularios se conservan de forma anonimizada junto con las estadísticas para análisis de investigación.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    No se mantiene información personal identificable más allá del tiempo estrictamente necesario para el análisis inicial.
                  </p>
                </div>
              </div>
            </section>

            {/* 9. Anonimización y Minimización de Datos */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Anonimización y Minimización de Datos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Aplicamos procesos de <strong>anonimización</strong> para garantizar la protección de tu identidad:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Eliminación de identificadores:</strong> Antes de generar cualquier estadística o informe, se eliminan todos los datos que puedan identificarte directa o indirectamente.</li>
                <li><strong>Minimización:</strong> Solo recopilamos los datos estrictamente necesarios para cumplir con los objetivos de investigación.</li>
                <li><strong>Uso anónimo:</strong> Los resultados académicos y publicaciones científicas siempre garantizan el <strong>anonimato</strong> de los participantes.</li>
              </ul>
            </section>

            {/* 10. Tus Derechos */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Tus Derechos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Como usuario de NoVa+, tienes los siguientes derechos sobre tus datos personales:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Derecho de Acceso:</strong> Puedes solicitar información sobre los datos que conservamos sobre ti.</li>
                <li><strong>Derecho de Rectificación:</strong> Puedes solicitar la corrección o actualización de datos inexactos o incompletos.</li>
                <li><strong>Derecho de Eliminación:</strong> Puedes solicitar la eliminación de tus datos personales antes del período de conservación establecido.</li>
                <li><strong>Derecho de Oposición:</strong> Puedes oponerte al procesamiento de tus datos para fines específicos.</li>
                <li><strong>Derecho de Revocación del Consentimiento:</strong> Puedes retirar tu consentimiento en cualquier momento, lo que impedirá el procesamiento futuro de tus datos.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Para ejercer cualquiera de estos derechos, puedes contactarnos a través de:<br />
                <strong>[correo electrónico a completar]</strong>
              </p>
              <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Importante:</strong> Dado que NoVa+ funciona de manera anónima y no requiere registro de usuario, una vez que los datos han sido anonimizados y agregados a las estadísticas de investigación, <strong>no será posible identificarlos ni eliminarlos de forma individualizada</strong>.
                </p>
              </div>
            </section>

            {/* 11. Uso Anónimo de la Plataforma */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Uso Anónimo de la Plataforma
              </h2>
              <p className="text-gray-700 leading-relaxed">
                NoVa+ <strong>NO requiere registro de usuario</strong> ni creación de cuentas. Tu participación es completamente anónima, y no almacenamos información que permita tu identificación personal continua en el sistema.
              </p>
            </section>

            {/* 12. Tratamiento de Datos Sensibles */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Tratamiento de Datos Sensibles
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Somos conscientes de que las conversaciones sobre adicción al juego pueden revelar información sensible. Por ello:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Los mensajes se cifran inmediatamente con algoritmos de seguridad avanzados.</li>
                <li>Se eliminan automáticamente después de 30 días.</li>
                <li>No existe acceso directo e indiscriminado del equipo de investigación a los mensajes.</li>
                <li>El acceso está restringido únicamente a investigadores autorizados con credenciales personales.</li>
                <li>Nunca compartimos el contenido de las conversaciones con terceros ajenos al proyecto.</li>
              </ul>
            </section>

            {/* 13. Transferencias Internacionales de Datos */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Transferencias Internacionales de Datos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Algunos de los servicios que utilizamos (Vercel, Neon, API de Gemini) pueden implicar la transferencia de datos fuera de Argentina. Estos proveedores cumplen con estándares internacionales de protección de datos y aplican medidas de seguridad adecuadas conforme a las normativas vigentes.
              </p>
            </section>

            {/* 14. Modificaciones a estas Políticas */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                14. Modificaciones a estas Políticas
              </h2>
              <p className="text-gray-700 leading-relaxed">
                El equipo de investigación podrá actualizar estas Políticas de Privacidad cuando sea necesario para reflejar cambios en nuestras prácticas, aspectos técnicos, legales o metodológicos, o por requisitos normativos.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Cualquier modificación será publicada en esta página con la fecha de actualización correspondiente. Se recomienda revisar periódicamente este documento.
              </p>
            </section>

            {/* 15. Contacto */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                15. Contacto
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si tienes preguntas, inquietudes o deseas ejercer tus derechos sobre tus datos personales, puedes contactarnos en:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Universidad Nacional de San Luis</strong><br />
                  Facultad de Psicología<br />
                  <strong>Correo electrónico:</strong> <a href="mailto:programa.adicciones.unsl1@gmail.com">programa.adicciones.unsl1@gmail.com</a><br />
                  <strong>Responsable:</strong>  Eliana Noemí González
                </p>
              </div>
            </section>

            {/* Aceptación de las Políticas */}
            <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                Aceptación de las Políticas
              </h2>
              <p className="text-blue-800 leading-relaxed">
                <strong>Al utilizar NoVa+, confirmas que has leído, comprendido y aceptado estas Políticas de Privacidad.</strong>
              </p>
              <p className="text-blue-800 leading-relaxed mt-2">
                El uso del asistente conversacional implica tu consentimiento expreso a los términos aquí establecidos, particularmente en lo que respecta a la recolección, almacenamiento, procesamiento y uso de tus datos personales con fines exclusivos de investigación científica y académica.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
