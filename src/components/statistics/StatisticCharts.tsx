"use client"

import { GeneralStats } from "@/types/statistics"
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Bar
} from "recharts"
import { useEffect, useState } from "react"

const GENDER_COLORS = ["#4f46e5", "#ec4899", "#f59e0b"]
const AGE_COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#f472b6", "#fbbf24"]
const RISK_COLORS = ["#10b981", "#facc15", "#f97316"]
const SENTIMENT_COLORS = ["#10b981", "#f97316", "#6366f1"]
const TYPE_COLORS = ["#3b82f6", "#f59e0b", "#ef4444", "#22c55e", "#8b5cf6", "#6b7280"]
const USEFUL_COLORS = ["#ef4444", "#f97316",  "#facc15", "#10b981", "#6b7280"]
interface StatisticsChartsProps {
    generalStats: GeneralStats[]
}

export function StatisticsCharts({ generalStats }: StatisticsChartsProps) {
    const [genderCounts, setGenderCounts] = useState<{ [key: string]: number }>({})
    const [ageCounts, setAgeCounts] = useState<{ [key: string]: number }>({})
    const [riskCounts, setRiskCounts] = useState<{ [key: string]: number }>({})
    const [sentimentCounts, setSentimentCounts] = useState<{ [key: string]: number }>({})
    const [usefulCounts, setUsefulCounts] = useState<{ [key: string]: number }>({})
    const [betCounts, setBetCounts] = useState<{ [key: string]: number }>({})

    useEffect(() => {
        const gender = { Femenino: 0, Masculino: 0, Otro: 0 }
        const escala = { "Muy en desacuerdo": 0, "En desacuerdo": 0, "Neutral": 0, "De acuerdo":0, "Muy de acuerdo": 0 }
        const betType = {
            "Casino presencial": 0,
            "Casino online": 0,
            "Videojuego": 0,
            "Lotería": 0,
            "Apuesta deportiva": 0,
            "No especifica": 0,
        }
        const sentiment = { Positivo: 0, Negativo: 0, Neutral: 0 }
        const age = { "13-16": 0, "17-20": 0, "21-25": 0, "26-40": 0, "41-99": 0 }
        const risk = { Alto: 0, Medio: 0, Bajo: 0 }

        for (const stat of generalStats) {
            switch (stat.gender) {
                case "FEMENINO": gender["Femenino"]++; break
                case "MASCULINO": gender["Masculino"]++; break
                case "OTRO": gender["Otro"]++; break
            }

            switch (stat.usefulToUnderstandRisks){
                case 1: escala["Muy en desacuerdo"]++; break
                case 2: escala["En desacuerdo"]++; break;
                case 3: escala["Neutral"]++;break;
                case 4: escala["De acuerdo"]++; break;
                case 5: escala["Muy de acuerdo"]++; break;
            }

            switch (stat.betType) {
                case "CASINO_PRESENCIAL": betType["Casino presencial"]++; break
                case "CASINO_ONLINE": betType["Casino online"]++; break
                case "VIDEOJUEGO": betType["Videojuego"]++; break
                case "LOTERIA": betType["Lotería"]++; break
                case "DEPORTIVA": betType["Apuesta deportiva"]++; break
                case "NO_ESPECIFICA": betType["No especifica"]++; break
            }

            switch (stat.mostFrequentSentiment) {
                case "POS": sentiment["Positivo"]++; break
                case "NEG": sentiment["Negativo"]++; break
                case "NEU": sentiment["Neutral"]++; break
            }

            const ageValue = stat.age
            if (ageValue >= 13 && ageValue <= 16) age["13-16"]++
            else if (ageValue >= 17 && ageValue <= 20) age["17-20"]++
            else if (ageValue >= 21 && ageValue <= 25) age["21-25"]++
            else if (ageValue >= 26 && ageValue <= 40) age["26-40"]++
            else if (ageValue >= 41 && ageValue <= 99) age["41-99"]++

            const score = stat.score
            if ([0, 1, 2].includes(score)) risk.Bajo++
            else if ([3, 4].includes(score)) risk.Medio++
            else if ([5, 6].includes(score)) risk.Alto++
        }
        setUsefulCounts(escala)
        setBetCounts(betType)
        setSentimentCounts(sentiment)
        setGenderCounts(gender)
        setAgeCounts(age)
        setRiskCounts(risk)
    }, [generalStats])

    const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }))
    const sentimentData = Object.entries(sentimentCounts).map(([name, value]) => ({ name, value }))
    const typeData = Object.entries(betCounts).map(([name, value]) => ({ name, value }))
    const usefulData = Object.entries(usefulCounts).map(([name, value]) => ({ name, value }))
    const ageData = Object.entries(ageCounts).map(([name, value]) => ({ name, value }))
    const riskData = Object.entries(riskCounts).map(([name, value]) => ({ name, value }))

    return (
        <>
            <div className="grid gap-6 md:grid-cols-3">
                {/* Género */}
                <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">Género</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={genderData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={70}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {genderData.map((entry, index) => (
                                    <Cell key={index} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Edad */}
                <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">Rangos de edad</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={ageData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={70}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {ageData.map((entry, index) => (
                                    <Cell key={index} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Riesgo */}
                <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">Niveles de riesgo</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={riskData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={70}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {riskData.map((entry, index) => (
                                    <Cell key={index} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                {/* Sentimientos */}
                <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">Sentimientos</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={sentimentData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                            <XAxis type="number" tick={{ fontSize: 12 }} />
                            <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                                {sentimentData.map((entry, index) => (
                                    <Cell key={index} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Tipo de apuesta */}
                <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">Tipo de apuesta</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={typeData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                            <XAxis type="number" tick={{ fontSize: 12 }} />
                            <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                                {typeData.map((entry, index) => (
                                    <Cell key={index} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Utilidad de comprender */}
                <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">Asistente fue util para entender los riesgos</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={usefulData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                            <XAxis type="number" tick={{ fontSize: 12 }} />
                            <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                                {usefulData.map((entry, index) => (
                                    <Cell key={index} fill={USEFUL_COLORS[index % USEFUL_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    )
}
