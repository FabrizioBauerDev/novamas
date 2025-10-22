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
import { convertStatsAction } from "@/lib/actions/actions-statistics"

const GENDER_COLORS = ["#ec4899", "#10b981", "#a855f7"]
const AGE_COLORS = ["#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#f59e0b"]
const RISK_COLORS = ["#ef4444", "#fbbf24","#10b981"]
const SENTIMENT_COLORS = ["#10b981", "#ef4444", "#6b7280"]
const TYPE_COLORS = ["#3b82f6", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6", "#6b7280"]
const USEFUL_COLORS = ["#ef4444", "#f97316", "#fbbf24", "#84cc16", "#10b981"]

interface StatisticsChartsProps {
    generalStats: GeneralStats[]
}

interface TooltipProps {
    active?: boolean
    payload?: Array<{
        name: string
        value: number
        fill: string
    }>
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-100">
                <p className="font-semibold text-gray-900">{payload[0].name}</p>
                <p className="text-sm text-gray-600">
                    Cantidad: <span className="font-bold text-indigo-600">{payload[0].value}</span>
                </p>
            </div>
        )
    }
    return null
}

const EmptyState = ({ message }: { message: string }) => (
    <div className="flex h-48 items-center justify-center">
        <div className="text-center space-y-2">
            <div className="text-gray-300 text-4xl">📊</div>
            <p className="text-gray-400 text-sm font-medium">{message}</p>
        </div>
    </div>
)

const ChartCard = ({ title, children, gradient }: { title: string; children: React.ReactNode; gradient?: string }) => (
    <div className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient || 'from-white to-gray-50'} p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500" />
        <div className="relative">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</h3>
            </div>
            {children}
        </div>
    </div>
)

export function StatisticsCharts({ generalStats }: StatisticsChartsProps) {
    const [genderCounts, setGenderCounts] = useState<{ [key: string]: number }>({})
    const [ageCounts, setAgeCounts] = useState<{ [key: string]: number }>({})
    const [riskCounts, setRiskCounts] = useState<{ [key: string]: number }>({})
    const [sentimentCounts, setSentimentCounts] = useState<{ [key: string]: number }>({})
    const [betCounts, setBetCounts] = useState<{ [key: string]: number }>({})
    const [countryCounts, setCountryCounts] = useState<{ [key: string]: number }>({})
    const [provinceCounts, setProvinceCounts] = useState<{ [key: string]: number }>({})
    const [averageCounts, setAverageCounts] = useState<{ [key: string]: number }>({})
    const [ratingCounts, setRatingCounts] = useState<{ [key: string]: number }>({})

    useEffect(() => {
        async function convertData(){
            const stats = await convertStatsAction(generalStats)
            setBetCounts(stats.betType)
            setSentimentCounts(stats.sentiment)
            setGenderCounts(stats.gender)
            setAgeCounts(stats.age)
            setRiskCounts(stats.risk)
            setCountryCounts(stats.country)
            setProvinceCounts(stats.province)
            setAverageCounts(stats.average)
            setRatingCounts(stats.rating)
        }
        convertData()
    }, [generalStats])

    const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }))
    const sentimentData = Object.entries(sentimentCounts).map(([name, value]) => ({ name, value }))
    const typeData = Object.entries(betCounts).map(([name, value]) => ({ name, value }))
    const averageData = Object.entries(averageCounts).map(([name, value]) => ({ name, value }))
    const ratingData = Object.entries(ratingCounts).map(([name, value]) => ({ name, value }))
    const ageData = Object.entries(ageCounts).map(([name, value]) => ({ name, value }))
    const riskData = Object.entries(riskCounts).map(([name, value]) => ({ name, value }))
    const countryData = Object.entries(countryCounts).map(([name, value]) => ({ name, value }))
    const provinceData = Object.entries(provinceCounts).map(([name, value]) => ({ name, value }))

    return (
        <div className="min-h-screen from-slate-50 space-y-12">
            {/* Demographics Section */}
            <div className="space-y-6">
                <div className="grid gap-8 md:grid-cols-3">
                    <ChartCard title="Género" gradient="from-pink-50 via-rose-50/50 to-white">
                        {genderData.some(data => data.value != 0) ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={genderData}
                                        cx="50%"
                                        cy="50%"
                                        dataKey="value"
                                        strokeWidth={2}
                                        stroke="#fff"
                                    >
                                        {genderData.map((entry, index) => (
                                            <Cell key={index} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        wrapperStyle={{ fontSize: "12px", fontWeight: "600" }}
                                        iconType="circle"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState message="Sin datos de género"/>
                        )}
                    </ChartCard>

                    <ChartCard title="Rangos de edad" gradient="from-blue-50 via-cyan-50/50 to-white">
                        {ageData.some(data => data.value != 0) ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={ageData}
                                        cx="50%"
                                        cy="50%"
                                        dataKey="value"
                                        strokeWidth={2}
                                        stroke="#fff"
                                    >
                                        {ageData.map((entry, index) => (
                                            <Cell key={index} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        wrapperStyle={{ fontSize: "12px", fontWeight: "600" }}
                                        iconType="circle"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState message="Sin datos de edad"/>
                        )}
                    </ChartCard>

                    <ChartCard title="Niveles de riesgo" gradient="from-red-50 via-orange-50/50 to-white">
                        {riskData.some(data => data.value != 0) ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={riskData}
                                        cx="50%"
                                        cy="50%"
                                        dataKey="value"
                                        strokeWidth={2}
                                        stroke="#fff"
                                    >
                                        {riskData.map((entry, index) => (
                                            <Cell key={index} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        wrapperStyle={{ fontSize: "12px", fontWeight: "600" }}
                                        iconType="circle"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState message="Sin datos de riesgo"/>
                        )}
                    </ChartCard>
                </div>
            </div>

            {/* Behavior Section */}
            <div className="space-y-6">
                <div className="grid gap-8 md:grid-cols-3">

                    <ChartCard title="Sentimientos" gradient="from-green-50 via-emerald-50/50 to-white">
                        {sentimentData.some(data => data.value != 0) ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={sentimentData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                                    <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <YAxis dataKey="name" type="category" width={80} stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: '600' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" radius={[0, 12, 12, 0]}>
                                        {sentimentData.map((entry, index) => (
                                            <Cell key={index} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState message="Sin datos de sentimientos"/>
                        )}
                    </ChartCard>

                    <ChartCard title="Tipo de apuesta" gradient="from-blue-50 via-indigo-50/50 to-white">
                        {typeData.some(data => data.value != 0) ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={typeData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                                    <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <YAxis dataKey="name" type="category" width={90} stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: '600' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" radius={[0, 12, 12, 0]}>
                                        {typeData.map((entry, index) => (
                                            <Cell key={index} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState message="Sin datos de apuestas"/>
                        )}
                    </ChartCard>

                    <ChartCard title="Promedio evaluación" gradient="from-amber-50 via-yellow-50/50 to-white">
                        {averageData.some(data => data.value != 0) ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={averageData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                                    <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <YAxis dataKey="name" type="category" width={90} stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: '600' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" radius={[0, 12, 12, 0]}>
                                        {averageData.map((entry, index) => (
                                            <Cell key={index} fill={USEFUL_COLORS[index % USEFUL_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState message="Sin datos de evaluación"/>
                        )}
                    </ChartCard>
                </div>
            </div>

            {/* Location & Rating Section */}
            <div className="space-y-6">
                <div className="grid gap-8 md:grid-cols-3">

                    <ChartCard title="Calificación del asistente" gradient="from-rose-50 via-pink-50/50 to-white">
                        {ratingData.some(data => data.value != 0) ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={ratingData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                                    <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <YAxis dataKey="name" type="category" width={90} stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: '600' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" radius={[0, 12, 12, 0]}>
                                        {ratingData.map((entry, index) => (
                                            <Cell key={index} fill={USEFUL_COLORS[index % USEFUL_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState message="Sin datos de calificación"/>
                        )}
                    </ChartCard>

                    <ChartCard title="País" gradient="from-cyan-50 via-sky-50/50 to-white">
                        {countryData.some(data => data.value != 0) ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={countryData}
                                        cx="50%"
                                        cy="50%"
                                        dataKey="value"
                                        strokeWidth={2}
                                        stroke="#fff"
                                    >
                                        {countryData.map((entry, index) => (
                                            <Cell key={index} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        wrapperStyle={{ fontSize: "12px", fontWeight: "600" }}
                                        iconType="circle"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState message="Sin datos de país"/>
                        )}
                    </ChartCard>

                    <ChartCard title="Provincia" gradient="from-violet-50 via-purple-50/50 to-white">
                        {provinceData.some(data => data.value != 0) ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={provinceData}
                                        cx="50%"
                                        cy="50%"
                                        dataKey="value"
                                        strokeWidth={2}
                                        stroke="#fff"
                                    >
                                        {provinceData.map((entry, index) => (
                                            <Cell key={index} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        wrapperStyle={{ fontSize: "12px", fontWeight: "600" }}
                                        iconType="circle"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState message="Sin datos de provincia"/>
                        )}
                    </ChartCard>
                </div>
            </div>
        </div>
    )
}
