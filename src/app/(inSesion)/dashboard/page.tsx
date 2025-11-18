import { auth } from "@/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Panel de control para especialistas de NoVa+. Accede a estadísticas, gestión de sesiones y gestión de bibliografía.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  const notStudent = session.user.role !== "ESTUDIANTE"
  const isAdmin = session.user.role === "ADMINISTRADOR"

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-2">
            Bienvenido, {session.user.name}
          </h1>
          <p className="text-blue-100 text-lg">
            Panel de Control NoVa+ - {session.user.role}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Módulos Principales */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Módulos del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card - Estadísticas - Solo Admin e Investigador */}
            {notStudent && (
            <Link href="/statistics">
              <div className="group bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Estadísticas</h3>
                <p className="text-gray-600 text-sm">Analiza métricas y datos de las sesiones del chatbot</p>
              </div>
            </Link>
            )}

            {/* Card - Grupos de Chat */}
            <Link href="/chatgroup">
              <div className="group bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sesiones Grupales</h3>
                <p className="text-gray-600 text-sm">Gestiona grupos de conversación y participantes</p>
              </div>
            </Link>

            {/* Card - Bibliografía - Solo Administrador e Investigador*/}
            {notStudent && (
            <Link href="/bibliography">
              <div className="group bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Bibliografía</h3>
                <p className="text-gray-600 text-sm">Administra recursos y referencias bibliográficas</p>
              </div>
            </Link>
            )
            }

            {/* Card - Perfil */}
            <Link href="/profile">
              <div className="group bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-300 to-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mi Perfil</h3>
                <p className="text-gray-600 text-sm">Configura tu información personal y preferencias</p>
              </div>
            </Link>

            {/* Card - Gestión de Usuarios (Solo Admin) */}
            {isAdmin && (
              <Link href="/usermanagement">
                <div className="group bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      Admin
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestión de Usuarios</h3>
                  <p className="text-gray-600 text-sm">Administra cuentas y permisos de usuarios</p>
                </div>
              </Link>
            )}

          </div>
        </section>

        {/* Acciones Rápidas */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Accesos Rápidos</h2>
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/chatNova"
                className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all group"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Chat NoVa+</h4>
                  <p className="text-sm text-gray-600">Iniciar conversación</p>
                </div>
              </Link>

              <Link
                href="/recursos"
                className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all group"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Recursos</h4>
                  <p className="text-sm text-gray-600">Material de apoyo</p>
                </div>
              </Link>

              <Link
                href="/emergencia"
                className="flex items-center p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg hover:from-red-100 hover:to-red-200 transition-all group"
              >
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Emergencia</h4>
                  <p className="text-sm text-gray-600">Líneas de ayuda</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}