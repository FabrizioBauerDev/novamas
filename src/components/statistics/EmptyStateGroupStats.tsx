import { BarChart3 } from "lucide-react"

export function EmptyStateGroupStats() {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-sm">
            <div className="mb-4 rounded-full bg-slate-100 p-6">
                <BarChart3 className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">Selecciona una sesión grupal</h3>
            <p className="text-center text-slate-500">
                Elige una sesión grupal del menú desplegable para ver sus estadísticas
            </p>
        </div>
    )
}
