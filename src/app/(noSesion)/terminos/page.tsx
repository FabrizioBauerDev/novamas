import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de NoVa+',
};

export default function TermsPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Encabezado */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Términos y Condiciones - NoVa+
            </h1>
            <p className="text-lg text-gray-600">
              Última actualización: 14 de Octubre del 2025
            </p>
          </div>

          {/* Contenido */}
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            {/* 1. Aceptación de los Términos */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Aceptación de los Términos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bienvenido/a a <strong>NoVa+</strong>, un asistente virtual con Inteligencia Artificial para la prevención e investigación del juego online en jóvenes y adolescentes, desarrollado por un equipo multidisciplinario de la <strong>Universidad Nacional de San Luis</strong>, perteneciente a la <strong>Facultad de Ciencias Físico Matemáticas y Naturales</strong> y la <strong>Facultad de Psicología</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Al acceder y utilizar esta plataforma, aceptas quedar vinculado/a por estos Términos y Condiciones, así como por nuestras Políticas de Privacidad.
              </p>
              <p className="text-gray-700 leading-relaxed font-semibold">
                Si no estás de acuerdo con estos términos, no debes utilizar NoVa+.
              </p>
            </section>

            {/* 2. Naturaleza del Servicio */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Naturaleza del Servicio
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    2.1 Proyecto de Investigación
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    NoVa+ es un <strong>proyecto de investigación académica</strong> desarrollado por alumnos avanzados de ingeniería en informática para su proyecto final integrador, en el marco del estudio <em>&quot;Evaluación de la Efectividad y Aceptación de un Asistente Virtual Basado en Inteligencia Artificial para la Prevención de la Adicción al Juego Online en Adolescentes&quot;</em>.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Este sistema tiene carácter <strong>experimental y de investigación científica</strong>. Su objetivo es:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Evaluar la efectividad de las intervenciones conversacionales basadas en inteligencia artificial para la prevención de adicciones al juego online</li>
                    <li>Contribuir al desarrollo del conocimiento en el campo de la psicología y la tecnología aplicada a la salud mental</li>
                    <li>Brindar información, orientación y apoyo preventivo sobre la adicción al juego online y el uso responsable de las apuestas digitales</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    Como proyecto en desarrollo, NoVa+ puede presentar limitaciones propias de sistemas experimentales, y su disponibilidad no está garantizada de forma indefinida.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    2.2 Finalidad del Sistema
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    El Asistente Virtual tiene como propósito <strong>brindar información educativa, orientación y apoyo preventivo</strong> relacionado con:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Juego responsable</li>
                    <li>Apuestas online</li>
                    <li>Adicción al juego online</li>
                    <li>Prevención de conductas problemáticas relacionadas con el juego</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    El sistema <strong>no sustituye la intervención profesional directa</strong> ni constituye una herramienta de diagnóstico, terapia o tratamiento psicológico.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    2.3 Interacción con Inteligencia Artificial
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4 font-semibold">
                    IMPORTANTE: Estás interactuando con un asistente virtual basado en Inteligencia Artificial (IA), no con una persona real.
                  </p>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    Funcionamiento y Explicabilidad del Sistema
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    El asistente conversacional de NoVa+ funciona mediante:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>
                      <strong>Tecnología:</strong> Modelo de lenguaje <strong>Gemini 2.5 Flash</strong> desarrollado por Google, complementado mediante un sistema de recuperación de información (<strong>RAG - Retrieval Augmented Generation</strong>)
                    </li>
                    <li>
                      <strong>Contenido especializado:</strong> Las respuestas del asistente se basan en:
                      <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                        <li>Documentos confiables y guías clínicas</li>
                        <li>Investigaciones académicas</li>
                        <li>Material de organizaciones de salud mental especializadas en adicción al juego</li>
                        <li>Documentos cuidadosamente seleccionados y validados por el equipo de psicólogos del proyecto</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Diseño supervisado:</strong> El comportamiento del asistente ha sido configurado mediante un prompt específico (instrucciones de sistema) diseñado conjuntamente por profesionales de la psicología e informática, y ha sido revisado y aprobado por psicólogos especializados
                    </li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    El sistema procesa tus mensajes, analiza el contexto de la conversación y genera respuestas personalizadas basándose en la información con la que ha sido entrenado y los documentos especializados proporcionados. El contenido de las respuestas puede variar en función del contexto, pero en ningún caso representa una recomendación médica o psicológica personalizada.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Limitaciones del Sistema */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Limitaciones del Sistema
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    3.1 No es un Sustituto Profesional
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4 font-semibold">
                    NoVa+ NO reemplaza la atención de un profesional de la salud mental, ni constituye terapia psicológica, asesoramiento médico o diagnóstico clínico.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    El asistente virtual es una herramienta de apoyo, información y prevención, pero:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>No puede realizar diagnósticos</strong> de adicción al juego ni de ninguna otra condición psicológica o médica</li>
                    <li><strong>No puede prescribir tratamientos</strong> ni ofrecer planes terapéuticos personalizados</li>
                    <li><strong>No sustituye la evaluación profesional</strong> realizada por psicólogos, psiquiatras u otros profesionales de la salud mental</li>
                    <li><strong>No emite juicios clínicos</strong> ni decisiones automatizadas que afecten derechos del usuario</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
                    Si experimentas dificultades significativas relacionadas con el juego online o cualquier otra problemática de salud mental, te recomendamos que consultes con un profesional calificado y consultes los contactos de emergencia.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    3.2 Alcance Temático
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    El asistente de NoVa+ está específicamente diseñado para tratar temas relacionados con la prevención de adicción al juego online y apuestas digitales.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>El sistema NO puede ni debe ser utilizado para consultas sobre otros temas.</strong> Si introduces consultas fuera de este alcance, el asistente te redirigirá al tema central o indicará que no puede ayudarte con ese tipo de solicitudes.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    3.3 Situaciones de Emergencia
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4 font-semibold">
                    NoVa+ NO está diseñado para gestionar crisis o emergencias.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Si te encuentras en una situación de emergencia, crisis emocional, riesgo de autolesión o cualquier situación que requiera atención inmediata:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>NO uses este chatbot como tu única fuente de ayuda</strong></li>
                    <li><strong>Contacta inmediatamente</strong> con servicios de emergencia, líneas de crisis o profesionales de la salud mental</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    El sistema está programado para detectar situaciones de riesgo elevado y, en esos casos, proporcionará números de contacto útiles de servicios de emergencia y apoyo psicológico según tu ubicación geográfica. Sin embargo, esta funcionalidad no garantiza la detección de todas las situaciones de riesgo.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    3.4 Posibilidad de Errores
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Aunque NoVa+ ha sido desarrollado con rigor académico y supervisión profesional, <strong>el asistente puede cometer errores, proporcionar información inexacta o incompleta, o no comprender correctamente tu consulta.</strong>
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Los sistemas de inteligencia artificial tienen limitaciones inherentes y no son infalibles. El funcionamiento del sistema depende de modelos de lenguaje probabilísticos que pueden presentar <strong>errores, omisiones o interpretaciones inexactas</strong>. Por ello:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Verifica información crítica</strong> con fuentes adicionales o profesionales</li>
                    <li><strong>No tomes decisiones importantes</strong> basándote únicamente en las respuestas del asistente</li>
                    <li><strong>Usa tu criterio personal</strong> al evaluar la información proporcionada</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. Requisitos de Uso */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Requisitos de Uso
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    4.1 Edad Mínima
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Para utilizar NoVa+ debes tener <strong>al menos 13 años de edad</strong>.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Usuarios entre 13 y 17 años:</strong> Deben contar con la <strong>autorización expresa de un padre, madre o tutor legal</strong> para participar en este estudio de investigación</li>
                    <li><strong>Usuarios mayores de 18 años:</strong> Pueden participar libremente sin autorización adicional</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    Al aceptar estos Términos y Condiciones, el usuario declara bajo su responsabilidad que cumple con los requisitos de edad y, en caso de ser menor de 18 años, que cuenta con la autorización correspondiente.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    4.2 Consentimiento Informado
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    El uso de NoVa+ requiere tu consentimiento libre, informado y expreso. Este consentimiento se otorga al marcar la casilla de aceptación en el formulario de Evaluación de Hábitos de Juego antes de acceder al asistente conversacional.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Al otorgar tu consentimiento, confirmas que:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Has leído y comprendido estos Términos y Condiciones y las Políticas de Privacidad</li>
                    <li>Comprendes que participas en un proyecto de investigación académica con fines científicos</li>
                    <li>Aceptas que tus datos serán procesados conforme a lo descrito en las Políticas de Privacidad</li>
                    <li>Eres mayor de 13 años y, si eres menor de 18, cuentas con autorización parental</li>
                    <li>Proporcionarás información veraz en los formularios previos</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. Conductas Prohibidas */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Conductas Prohibidas
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para garantizar el correcto funcionamiento de NoVa+ y proteger la integridad de la investigación, quedan <strong>expresamente prohibidas</strong> las siguientes conductas:
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    5.1 Uso Indebido del Sistema
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Manipulación del asistente:</strong> Intentar eludir, alterar o manipular el funcionamiento del sistema, incluyendo intentos de extraer el prompt de sistema o modificar el comportamiento del asistente mediante técnicas de ingeniería de prompts maliciosas</li>
                    <li><strong>Uso automatizado:</strong> Utilizar bots, scripts, herramientas automatizadas o cualquier medio que no sea la interacción humana directa para acceder al servicio</li>
                    <li><strong>Spam:</strong> Enviar mensajes repetitivos, sin sentido o con el único propósito de saturar el sistema</li>
                    <li><strong>Acceso no autorizado:</strong> Intentar acceder, modificar o extraer información del sistema, sus bases de datos o componentes técnicos</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    5.2 Información Falsa
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Proporcionar deliberadamente información falsa, engañosa o fraudulenta en los formularios o durante las conversaciones</li>
                    <li>Suplantar la identidad de otra persona</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    5.3 Uso Inapropiado
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Utilizar el asistente para acosar, intimidar, insultar o agredir verbalmente</li>
                    <li>Usar lenguaje ofensivo, discriminatorio o que promueva el odio durante la interacción</li>
                    <li>Introducir contenido ilegal, difamatorio, obsceno o que promueva actividades ilegales</li>
                    <li>Usar la plataforma con fines comerciales no autorizados o para generar contenido inapropiado</li>
                    <li>Reproducir, copiar o distribuir el contenido generado sin autorización del equipo de investigación</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    5.4 Consecuencias del Incumplimiento
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    El incumplimiento de estas normas podrá derivar en la suspensión o bloqueo del acceso al Asistente. La Universidad Nacional de San Luis y el equipo de investigación no se hacen responsables de las consecuencias derivadas del uso indebido o prohibido de la plataforma por parte de los usuarios.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Derechos de Propiedad Intelectual */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Derechos de Propiedad Intelectual
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Todos los contenidos de NoVa+, incluyendo pero no limitado a:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Software y código fuente</li>
                <li>Diseño, textos y gráficos</li>
                <li>Estructura y arquitectura del sistema</li>
                <li>Documentación especializada</li>
                <li>Prompt de sistema del asistente</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Son propiedad del <strong>equipo de desarrollo e investigación</strong> del proyecto.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Los componentes tecnológicos provistos por terceros (como Google Gemini o Vercel) mantienen sus respectivos derechos de propiedad.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Queda prohibida la reproducción, distribución, modificación o cualquier forma de explotación del contenido de NoVa+ sin autorización expresa y por escrito del equipo de investigación y desarrollo. El contenido generado no puede ser reproducido ni reutilizado fuera del ámbito educativo o de investigación sin autorización.
              </p>
            </section>

            {/* 7. Limitación de Responsabilidad */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Limitación de Responsabilidad
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    7.1 Uso Bajo Tu Propia Responsabilidad
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    El uso de NoVa+ es <strong>completamente voluntario y bajo tu propia responsabilidad</strong>. El sistema se ofrece <strong>&quot;tal cual está&quot;</strong>, con fines académicos y de investigación, sin garantía de disponibilidad permanente ni resultados específicos.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Al utilizar este servicio, reconoces y aceptas que el equipo de NoVa+, su personal, investigadores, colaboradores y la Universidad Nacional de San Luis <strong>no serán responsables</strong> por cualquier daño, perjuicio, pérdida o inconveniente derivado de:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>El uso o la imposibilidad de uso de NoVa+</li>
                    <li>Las decisiones o acciones que adoptes en base a la información brindada por el Asistente</li>
                    <li>Errores, inexactitudes, omisiones o interpretaciones inexactas en las respuestas del asistente</li>
                    <li>Decisiones tomadas basándose en la información proporcionada por el sistema</li>
                    <li>Interrupciones, caídas, fallos técnicos o problemas de disponibilidad del servicio</li>
                    <li>Interrupciones temporales del servicio, errores en el procesamiento de datos o pérdida de información</li>
                    <li>Pérdida de datos o problemas de seguridad, salvo negligencia grave demostrable</li>
                    <li>Daños directos o indirectos derivados del uso del sistema</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    7.2 Servicios de Terceros
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    NoVa+ utiliza servicios de terceros (Vercel para hosting, Neon para base de datos, API de Gemini para el asistente conversacional). El equipo no se hace responsable por interrupciones, errores o problemas de privacidad derivados de estos servicios externos, aunque se han seleccionado proveedores confiables y se implementan medidas de seguridad adecuadas.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    7.3 Contenido Generado por el Usuario
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    No somos responsables por el contenido de los mensajes que envíes al asistente. Es tu responsabilidad asegurarte de no compartir información que pueda comprometer tu seguridad o privacidad.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    7.4 Enlaces Externos
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Si el asistente proporciona enlaces a recursos externos, estos se ofrecen únicamente con fines informativos. No controlamos ni respaldamos el contenido de sitios web de terceros y no asumimos responsabilidad por su contenido, políticas de privacidad o prácticas.
                  </p>
                </div>
              </div>
            </section>

            {/* 8. Disponibilidad del Servicio */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Disponibilidad del Servicio
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                NoVa+ se proporciona &quot;tal cual está&quot; sin garantías de disponibilidad continua. El Proyecto no garantiza la <strong>disponibilidad continua</strong> del servicio ni la ausencia de interrupciones, fallas técnicas o demoras.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nos reservamos el derecho de:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Modificar, suspender o discontinuar el servicio en cualquier momento sin previo aviso</li>
                <li>Realizar mantenimientos programados o no programados que puedan afectar la disponibilidad</li>
                <li>Finalizar el proyecto de investigación una vez cumplidos sus objetivos académicos</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                No garantizamos que el servicio esté libre de errores, aunque implementamos medidas de seguridad razonables y mejores prácticas de desarrollo.
              </p>
            </section>

            {/* 9. Modificaciones a los Términos y Condiciones */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Modificaciones a los Términos y Condiciones
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Estos Términos y Condiciones <strong>no serán modificados durante la duración del proyecto de investigación</strong>. La versión actual es la que permanecerá vigente durante toda la operación de NoVa+.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Si por razones excepcionales fuera necesario realizar modificaciones, se notificarán claramente en la plataforma y se solicitará la aceptación de los nuevos términos antes de continuar utilizando la aplicación.
              </p>
            </section>

            {/* 10. Jurisdicción y Ley Aplicable */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Jurisdicción y Ley Aplicable
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Estos Términos y Condiciones se rigen por las leyes de la <strong>República Argentina</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Cualquier controversia, conflicto o reclamación derivada de estos Términos y Condiciones o del uso de NoVa+ será sometida a la jurisdicción exclusiva de los <strong>tribunales ordinarios de la ciudad de San Luis, Provincia de San Luis, Argentina</strong>, renunciando las partes a cualquier otro fuero o jurisdicción que pudiera corresponder.
              </p>
            </section>

            {/* 11. Separabilidad */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Separabilidad
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Si alguna disposición de estos Términos y Condiciones es declarada inválida, ilegal o inaplicable por una autoridad competente, las demás disposiciones continuarán en pleno vigor y efecto.
              </p>
            </section>

            {/* 12. Aceptación Final */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Aceptación Final
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                El uso del Asistente implica la <strong>aceptación plena y sin reservas</strong> de estos Términos y Condiciones y las Políticas de Privacidad correspondientes.
              </p>
              <p className="text-gray-700 leading-relaxed">
                El uso de la Plataforma debe ser <strong>informado y responsable</strong>, reconociendo sus límites como herramienta de apoyo y no de tratamiento.
              </p>
            </section>

            {/* 13. Contacto */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Contacto
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si tienes preguntas, comentarios, inquietudes, consultas, reclamos o solicitudes relacionadas con estos Términos y Condiciones, el funcionamiento del Asistente o el tratamiento de los datos personales, puedes contactarnos en:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Universidad Nacional de San Luis</strong><br />
                  <strong>Facultad de Psicología</strong><br />
                  <strong>Correo electrónico:</strong> [correo a completar]<br />
                  <strong>Responsable:</strong> [Nombre de la Directora del Proyecto]
                </p>
              </div>
            </section>

            {/* Aceptación */}
            <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <p className="text-blue-800 leading-relaxed text-center italic">
                Al utilizar NoVa+, confirmas que has leído, comprendido y aceptado estos Términos y Condiciones en su totalidad.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
