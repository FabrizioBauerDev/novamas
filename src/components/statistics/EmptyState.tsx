import { BarChart3 } from "lucide-react"

export function EmptyState() {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-sm">
            <div className="mb-4 rounded-full bg-slate-100 p-6">
                <BarChart3 className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">No hay estadisticas disponibles para mostrar</h3>
            <p className="text-center text-slate-500">
                Cuando se registre alguna sesión los valores se verán reflejados aca.
            </p>
        </div>
    )
}
