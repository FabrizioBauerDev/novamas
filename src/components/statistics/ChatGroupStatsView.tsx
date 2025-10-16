"use client"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BarChart3, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import type {ConversationInfo} from "@/types/statistics"
import {getStatsConversationInfoAction} from "@/lib/actions/actions-statistics"
import { SlugStatisticSkeleton } from "@/components/statistics/SlugStatisticSkeleton"
import type { GenderType } from "@/lib/enums"
import { toast } from "sonner"
import {getGroupConversationInfoAction} from "@/lib/actions/actions-chatgroup";

interface SlugViewProps {
    chatGroupId?: string
}

type RiskLevel = "Bajo" | "Medio" | "Alto"

const CONVERSATIONS_PER_PAGE = 5

export default function ChatGroupStatsView({ chatGroupId = "" }: SlugViewProps) {
    const [filterRisk, setFilterRisk] = useState<string>("todos")
    const [filterGender, setFilterGender] = useState<string>("todos")
    const [sortBy, setSortBy] = useState<string>("fecha")
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [conversaciones, setConversaciones] = useState<ConversationInfo[]>([])
    const [chatGroupInfo, setChatGroupInfo] = useState<{ id: string; name: string; startDate: Date }>({
        id: "",
        name: "",
        startDate: new Date(),
    })

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            try {
                const result = await getStatsConversationInfoAction(chatGroupId);
                const groupResult = await getGroupConversationInfoAction(chatGroupId);

                if (result.success) {
                    setConversaciones(result.data || [])
                } else {
                    toast.error("Error al obtener las estadísticas", {
                        description: result.error || "No se pudo obtener las estadísticas.",
                        duration: 5000,
                    })
                }

                if (groupResult.success && groupResult.data) {
                    setChatGroupInfo(groupResult.data)
                } else {
                    toast.error("Error al obtener la información del grupo", {
                        description: groupResult.error || "No se pudo obtener la información del grupo.",
                        duration: 5000,
                    })
                }
            } catch (err) {
                toast.error("Error al cargar los datos", {
                    description: "Ocurrió un error inesperado.",
                    duration: 5000,
                })
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [chatGroupId])

    useEffect(() => {
        setCurrentPage(1)
    }, [filterRisk, filterGender, sortBy])

    const filteredAndSortedConversations = useMemo(() => {
        let filtered = [...conversaciones]

        if (filterRisk !== "todos") {
            filtered = filtered.filter((conv) => {
                const convRisk = conv.risk > 5 ? "alto" : conv.risk > 4 ? "medio" : "bajo"
                return convRisk === filterRisk.toLowerCase()
            })
        }

        if (filterGender !== "todos") {
            filtered = filtered.filter((conv) => {
                const convGender = conv.gender.toLowerCase()
                return convGender === filterGender.toLowerCase()
            })
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "riesgo": {
                    const riskOrder: Record<string, number> = {
                        alto: 3,
                        medio: 2,
                        bajo: 1,
                    }
                    const aRisk = riskOrder[a.risk > 5 ? "alto" : a.risk > 4 ? "medio" : "bajo"] || 0
                    const bRisk = riskOrder[b.risk > 5 ? "alto" : b.risk > 4 ? "medio" : "bajo"] || 0
                    return bRisk - aRisk
                }
                case "sentimiento":
                    return b.negativePercentage - a.negativePercentage
                case "fecha":
                default:
                    return b.date.getTime() - a.date.getTime()
            }
        })

        return filtered
    }, [filterRisk, filterGender, sortBy, conversaciones])

    const totalPages = Math.ceil(filteredAndSortedConversations.length / CONVERSATIONS_PER_PAGE)
    const startIndex = (currentPage - 1) * CONVERSATIONS_PER_PAGE
    const endIndex = startIndex + CONVERSATIONS_PER_PAGE
    const paginatedConversations = filteredAndSortedConversations.slice(startIndex, endIndex)

    const getRiskColor = (risk: RiskLevel) => {
        switch (risk) {
            case "Alto":
                return "bg-red-100 text-red-700 border-red-200"
            case "Medio":
                return "bg-amber-100 text-amber-700 border-amber-200"
            case "Bajo":
                return "bg-green-100 text-green-700 border-green-200"
        }
    }

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

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="container mx-auto max-w-7xl px-8 py-6">
                <Link href="/statistics">
                    <Button variant="ghost" className="mb-4 gap-2 text-slate-600 hover:text-slate-900">
                        <ArrowLeft className="h-4 w-4" />
                        Volver a Estadísticas
                    </Button>
                </Link>

                {loading ? (
                    <SlugStatisticSkeleton />
                ) : (
                    <>
                        <div className="flex items-start justify-between gap-4">
                        <h2 className="mb-8 text-4xl font-bold text-slate-900">
                            Conversaciones de la prueba: {chatGroupInfo.name}
                        </h2>

                            <Button
                                variant="outline"
                                size="lg"
                                className="border-slate-300 bg-white px-8 py-6 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow-md"
                            >
                                Exportar las estadísticas a Excel
                            </Button>
                        </div>

                        <div className="mb-8 flex flex-wrap gap-4">
                            <Select value={filterRisk} onValueChange={setFilterRisk}>
                                <SelectTrigger className="w-[200px] rounded-xl border-slate-300 bg-white shadow-sm">
                                    <SelectValue placeholder="Filtrar por riesgo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos los riesgos</SelectItem>
                                    <SelectItem value="alto">Alto riesgo</SelectItem>
                                    <SelectItem value="medio">Riesgo medio</SelectItem>
                                    <SelectItem value="bajo">Bajo riesgo</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filterGender} onValueChange={setFilterGender}>
                                <SelectTrigger className="w-[200px] rounded-xl border-slate-300 bg-white shadow-sm">
                                    <SelectValue placeholder="Filtrar por sexo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos los sexos</SelectItem>
                                    <SelectItem value="masculino">Masculino</SelectItem>
                                    <SelectItem value="femenino">Femenino</SelectItem>
                                    <SelectItem value="otro">Otro</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[240px] rounded-xl border-slate-300 bg-white shadow-sm">
                                    <SelectValue placeholder="Ordenar por" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fecha">Más recientes</SelectItem>
                                    <SelectItem value="riesgo">Mayor riesgo</SelectItem>
                                    <SelectItem value="sentimiento">Más sentimiento negativo</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="ml-auto text-sm text-slate-600">
                                {filteredAndSortedConversations.length} conversaciones
                            </div>
                        </div>

                        <div className="space-y-4">
                            {paginatedConversations.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="mb-3 flex items-center gap-3">
                                                <h3 className="text-xl font-semibold text-slate-900">{chatGroupInfo.name}</h3>
                                                <span className="rounded-full border bg-slate-50 px-3 py-1 text-sm text-slate-700">
                          {getGenderLabel(conversation.gender)}
                        </span>
                                                <span
                                                    className={`rounded-full border px-3 py-1 text-sm font-medium ${getRiskColor(conversation.risk > 5 ? "Alto" : conversation.risk > 4 ? "Medio" : "Bajo")}`}
                                                >
                          Riesgo {conversation.risk > 5 ? "Alto" : conversation.risk > 4 ? "Medio" : "Bajo"}
                        </span>
                                            </div>
                                            <p className="text-slate-600 leading-relaxed">{conversation.summary}</p>
                                            <p className="mt-2 text-sm text-slate-400">
                                                {new Date(conversation.date).toLocaleDateString("es-ES", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <Link href={`/statistics/${chatGroupId}/${conversation.id}`}>
                                            <Button className="gap-2 rounded-xl bg-blue-600 px-6 py-5 text-white shadow-md hover:bg-blue-700">
                                                <BarChart3 className="h-4 w-4" />
                                                Ver estadísticas
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="gap-1 rounded-lg border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Anterior
                                    </Button>

                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCurrentPage(page)}
                                                className={`h-9 w-9 rounded-lg ${
                                                    currentPage === page
                                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                                }`}
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="gap-1 rounded-lg border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        Siguiente
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                        </div>

                        {filteredAndSortedConversations.length === 0 && !loading && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                                <p className="text-lg text-slate-500">No se encontraron conversaciones con los filtros seleccionados</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}
