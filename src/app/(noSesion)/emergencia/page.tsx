import { provincias } from "@/contactos-provincia";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contactos de Emergencia',
  description: 'Líneas de ayuda y asistencia para adicción al juego y prevención del suicidio en Argentina. Contactos nacionales y provinciales.',
  keywords: ['emergencia', 'línea de ayuda', 'ludopatía', 'prevención suicidio', 'contactos provinciales', 'argentina', 'ayuda inmediata'],
  openGraph: {
    title: 'Contactos de Emergencia | NoVa+',
    description: 'Líneas de ayuda y asistencia en cada provincia de Argentina para adicción al juego y prevención del suicidio.',
    type: 'website',
  }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-blue-950 text-white py-8 text-center">
        <h1 className="text-3xl font-bold">Contactos de Emergencia Argentina</h1>
        <p className="text-gray-300 mt-2">
          Líneas de ayuda y asistencia en cada provincia
        </p>
      </header>

      {/* Sección Números Nacionales */}
      <section className="py-10 px-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Números Nacionales</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6 max-w-5xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg shadow p-6 flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Línea 102</h3>
            <p className="text-gray-700">Atención a la Adolescencia</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow p-6 flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Línea 135 / 5275-1135</h3>
            <p className="text-gray-700">Prevención del Suicidio</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow p-6 flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2">911</h3>
            <p className="text-gray-700">Emergencias Generales</p>
          </div>
        </div>
      </section>

      {/* Listado por provincia */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Contactos Provinciales
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {provincias.map((prov) => (
            <div key={prov.nombre} className="bg-white rounded-lg shadow p-5 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">{prov.nombre}</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  <strong className="text-gray-900">Ludopatía:</strong> {prov.ludopatia}
                </p>
                <p className="text-gray-700">
                  <strong className="text-gray-900">Prevención del Suicidio:</strong> {prov.suicidio}
                </p>
                <p className="text-gray-700">
                  <strong className="text-gray-900">Adolescencia:</strong> Línea 102
                </p>
              </div>
              {prov.link && (
                <a
                  href={prov.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-800 mt-4 inline-block underline font-medium hover:text-blue-600 transition-colors"
                >
                  Página de Juego Responsable
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
