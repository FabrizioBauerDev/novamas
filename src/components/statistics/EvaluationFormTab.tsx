import {CouldntStopType, GenderType, PersonalIssuesType} from "@/lib/enums";


interface EvaluationFormData {
    gender: GenderType
    age: number
    onlineGaming: boolean
    couldntStop: CouldntStopType
    personalIssues: PersonalIssuesType
    triedToQuit: boolean
    score: number
}

interface EvaluationFormTabProps {
    formData: EvaluationFormData
}

export function EvaluationFormTab({ formData }: EvaluationFormTabProps) {
    const getGenderLabel = (gender: GenderType) => {
        switch (gender) {
            case "MASCULINO":
                return "Masculino"
            case "FEMENINO":
                return "Femenino"
            case "OTRO":
                return "Otro"
        }
    }

    const getCouldntStopLabel = (value: string) => {
        const labels: Record<string, string> = {
            NO: "No",
            NO_ES_SEG: "No está seguro/a",
            SI: "Sí",
        }
        return labels[value] || value
    }

    const getPersonalIssuesLabel = (value: string) => {
        const labels: Record<string, string> = {
            NO: "No",
            NO_AP: "No aplica",
            SI: "Sí",
        }
        return labels[value] || value
    }

    const getRiskScoreColor = (score: number) => {
        if (score >= 0 && score <= 3) {
            return "text-blue-600 bg-blue-100"
        } else if (score >= 4 && score <= 5) {
            return "text-amber-600 bg-amber-100"
        } else {
            return "text-red-600 bg-red-100"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Evaluación Inicial</h3>
                <div className={`rounded-lg px-4 py-2 ${getRiskScoreColor(formData.score)}`}>
                    <span className="text-m font-medium">Riesgo: </span>
                    <span className="text-l font-bold">{formData.score > 5 ? "Alto" : formData.score > 4 ? "Medio" : "Bajo"}</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">Género</p>
                    <p className="text-2xl font-bold text-slate-900">{getGenderLabel(formData.gender)}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">Edad</p>
                    <p className="text-2xl font-bold text-slate-900">{formData.age} años</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">Participa en juegos en línea</p>
                    <p className="text-2xl font-bold text-slate-900">{formData.onlineGaming ? "Sí" : "No"}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">No pudo parar de apostar o jugó más tiempo del pensado</p>
                    <p className="text-2xl font-bold text-slate-900">{getCouldntStopLabel(formData.couldntStop)}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">Le causó problemas personales</p>
                    <p className="text-2xl font-bold text-slate-900">{getPersonalIssuesLabel(formData.personalIssues)}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">Intentó dejarlo</p>
                    <p className="text-2xl font-bold text-slate-900">{formData.triedToQuit ? "Sí" : "No"}</p>
                </div>
            </div>
        </div>
    )
}
