import { Button } from "@/components/ui/button"

export function TopStatistics({analyzedTrue, analyzedFalse}: {analyzedTrue: number, analyzedFalse: number}) {
    return (
        <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm border border-slate-200">
                <span className="text-lg font-bold text-blue-600">{analyzedTrue}</span>
                <span className="text-sm text-slate-600">Sesiones analizadas</span>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm border border-slate-200">
                <span className="text-lg font-bold text-amber-600">{analyzedFalse}</span>
                <span className="text-sm text-slate-600">Sesiones por analizar</span>
            </div>

            <Button
                size="lg"
                disabled={analyzedFalse === 0}
                className="h-auto rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-3 text-base font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
                Analizar
            </Button>
        </div>
    )
}
