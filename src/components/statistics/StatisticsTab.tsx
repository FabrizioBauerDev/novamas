import {BetType, SentimentType} from "@/types/statistics";

interface StatisticsTabProps {
    summary: string
    amountMessages: number
    minWordsPerMessage: number
    maxWordsPerMessage: number
    mostFrequentSentiment: SentimentType
    hateSpeech: boolean
    ironic: boolean
    changeTheme: boolean
    betType: BetType
    positivePercentage: number
    negativePercentage: number
    neutralPercentage: number
}

export function StatisticsTab({
                                  summary,
                                  amountMessages,
                                  minWordsPerMessage,
                                  maxWordsPerMessage,
                                  mostFrequentSentiment,
                                  hateSpeech,
                                  ironic,
                                  changeTheme,
                                  betType,
                                  positivePercentage,
                                  negativePercentage,
                                  neutralPercentage,
                              }: StatisticsTabProps) {
    const getBetTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            CASINO_PRESENCIAL: "Casino Presencial",
            CASINO_ONLINE: "Casino Online",
            DEPORTIVA: "Apuesta Deportiva",
            LOTERIA: "Lotería",
            VIDEOJUEGO: "Videojuego",
            NO_ESPECIFICA: "No Especifica",
        }
        return labels[type] || type
    }

    const getSentimentLabel = (type: string) => {
        const labels: Record<string, string> = {
            POS: "Positivo",
            NEU: "Neutral",
            NEG: "Negativo",
        }
        return labels[type] || type
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4 text-xl font-semibold text-slate-900">Resumen de la Conversación</h3>
                <p className="text-l leading-relaxed text-slate-700">{summary}</p>
            </div>

            <div className="flex flex-wrap gap-6 justify-center">
                <div className="rounded-xl bg-slate-50 p-6 w-full md:w-auto md:min-w-[300px]">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">Tipo de Apuesta</p>
                    <p className="text-3xl font-bold text-slate-900">{getBetTypeLabel(betType)}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-6 w-full md:w-auto md:min-w-[300px]">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">
                        Sentimiento más frecuente
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{getSentimentLabel(mostFrequentSentiment)}</p>
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">Mensajes Totales</p>
                    <p className="text-3xl font-bold text-slate-900">{amountMessages}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">
                        Palabras Mínimas por Mensaje
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{minWordsPerMessage}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">
                        Palabras Máximas por Mensaje
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{maxWordsPerMessage}</p>
                </div>

                <div className="rounded-xl bg-green-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-green-700">Mensajes Positivos</p>
                    <p className="text-3xl font-bold text-green-900">{positivePercentage}%</p>
                </div>

                <div className="rounded-xl bg-red-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-red-700">Mensajes Negativos</p>
                    <p className="text-3xl font-bold text-red-900">{negativePercentage}%</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">Mensajes Neutrales</p>
                    <p className="text-3xl font-bold text-slate-900">{neutralPercentage}%</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">
                        Lenguaje Ofensivo
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{hateSpeech ? "Utilizó lenguaje ofensivo" : "No utilizó lenguaje ofensivo"}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">Ironía</p>
                    <p className="text-3xl font-bold text-slate-900">{ironic ? "Utilizó lenguaje irónico" : "No utilizó lenguaje irónico"}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-6">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">Cambió de Tema</p>
                    <p className="text-3xl font-bold text-slate-900">{changeTheme ? "Sí" : "No"}</p>
                </div>
            </div>
        </div>
    )
}
