import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Bot, Wrench } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: '404 - Página no encontrada',
  description: 'La página que buscas no existe o está en construcción. Vuelve al inicio de NoVa+.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PerfilPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-4">
        {/* Header con botón de regreso */}
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        {/* Contenido principal */}
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-6">
              {/* Icono animado */}
              <div className="relative mb-8">
                <div className="absolute inset-0 animate-ping">
                  <Bot className="h-20 w-20 mx-auto text-blue-500/30" />
                </div>
                <Bot className="h-20 w-20 mx-auto text-blue-600 dark:text-blue-400 relative z-10" />
              </div>

              {/* Título principal */}
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                NoVa+
              </h1>

              {/* Subtítulo */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <Wrench className="h-5 w-5 text-amber-500" />
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-300">
                  En Construcción
                </h2>
                <Wrench className="h-5 w-5 text-amber-500" />
              </div>

              {/* Descripción */}
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Estamos trabajando.
              </p>
            </CardContent>
          </Card>

          {/* Mensaje adicional */}
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Mientras tanto, puedes seguir utilizando las funcionalidades disponibles.
          </p>
        </div>
      </div>

      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}
