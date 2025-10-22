import {FinalForm} from "@/types/statistics"
import {ScaleEnum} from "@/lib/enums";

interface FinalFormProps {
    finalForm: FinalForm;
}
export function FinalFormTab({ finalForm }: FinalFormProps) {

    const getAverageColor = () => {
        if (finalForm.average >= 4) return "text-green-600 bg-green-100"
        if (finalForm.average >= 3) return "text-amber-600 bg-amber-100"
        return "text-red-600 bg-red-100"
    }

    return (
        <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-slate-900">Evaluación Final</h3>
        <div className={`rounded-lg px-4 py-2 ${getAverageColor()}`}>
        <span className="text-sm font-medium">Promedio: </span>
        <span className="text-lg font-bold">{finalForm.average}/5</span>
        </div>
        </div>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <div className="rounded-xl bg-slate-50 p-6">
    <p className="mb-2 text-sm font-medium tracking-wide text-slate-500">El diseño del asistente fue realista y atractivo.</p>
    <p className={`text-2xl font-bold`}>
    {ScaleEnum[finalForm.assistantDesign as keyof typeof ScaleEnum]}
    </p>
    </div>

    <div className="rounded-xl bg-slate-50 p-6">
    <p className="mb-2 text-sm font-medium tracking-wide text-slate-500">El asistente explicó bien su alcance y propósito.</p>
    <p className={`text-2xl font-bold`}>
    {ScaleEnum[finalForm.assistantPurpose as keyof typeof ScaleEnum]}
    </p>
    </div>

    <div className="rounded-xl bg-slate-50 p-6">
    <p className="mb-2 text-sm font-medium tracking-wide text-slate-500">Las respuestas del asistente fueron útiles, adecuadas e informativas.</p>
    <p className={`text-2xl font-bold`}>
    {ScaleEnum[finalForm.assistantResponses as keyof typeof ScaleEnum]}
    </p>
    </div>

    <div className="rounded-xl bg-slate-50 p-6">
    <p className="mb-2 text-sm font-medium tracking-wide text-slate-500">El asistente resulta fácil de usar.</p>
    <p className={`text-2xl font-bold`}>
    {ScaleEnum[finalForm.userFriendly as keyof typeof ScaleEnum]}
    </p>
    </div>

    <div className="rounded-xl bg-slate-50 p-6">
    <p className="mb-2 text-sm font-medium tracking-wide text-slate-500">El asistente te fue de utilidad para comprender los riesgos asociados al
        uso excesivo del juego online.</p>
    <p className={`text-2xl font-bold`}>
    {ScaleEnum[finalForm.usefulToUnderstandRisks as keyof typeof ScaleEnum]}
    </p>
    </div>
    </div>
    </div>
)
}
