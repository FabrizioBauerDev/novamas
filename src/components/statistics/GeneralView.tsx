"use client"
import React, { useEffect, useState } from "react";
import {
    callAPI,
    convertStatsAction,
    getGeneralStatisticsAction,
    getNumberStatsAction
} from "@/lib/actions/actions-statistics";
import { GeneralStats } from "@/types/statistics";
import { EmptyStateGroupStats } from "@/components/statistics/EmptyStateGroupStats";
import { StatisticSkeleton } from "@/components/statistics/StatisticSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatisticsCharts } from "./StatisticCharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {getGroupNamesAction} from "@/lib/actions/actions-chatgroup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {EmptyState} from "@/components/statistics/EmptyState";
import {toast} from "sonner";
import {createExcel} from "@/lib/actions/actions-excel";
import { useRouter } from "next/navigation";
import {Loader2, Download, TrendingUp, Clock, ArrowLeft} from "lucide-react";

interface GeneralViewProps {
    currentUser:string;
}

export function GeneralView({currentUser}: GeneralViewProps) {
    const router = useRouter();
    const [selectedGroup, setSelectedGroup] = useState<string>("todas");
    const [selectedChatGroup, setSelectedChatGroup] = useState<{ id: string; name: string; startDate: Date; }>({
        id: "",
        name: "",
        startDate: new Date()
    });
    const [availableChatGroups, setAvailableChatGroups] = useState<{ id: string; name: string; startDate: Date }[]>([]);
    const [generalStats, setGeneralStats] = useState<GeneralStats[]>([]);
    const [topStats, setTopStats] = useState<{ analyzedTrue: number; analyzedFalse: number }>({
        analyzedTrue: 0,
        analyzedFalse: 0,
    });
    const [loading, setLoading] = useState(true);
    const [loadingTop, setLoadingTop] = useState(true);
    const [loadingExcel, setLoadingExcel] = useState(false);
    const [loadingAPI, setLoadingAPI] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handlePostStats = async () => {
        setLoadingAPI(true);
        try {
            const res = await callAPI();

            if (res.ok) {
                console.log(res.message)
                toast.success(res.message, {
                    description: "Operación de estadisticas finalizada correctamente.",
                    duration: 5000,
                });
            } else {
                console.log(res.message)
                toast.error("Error al analizar las estadísticas", {
                    description: "Intente nuevamente en unos minutos, si el problema persiste cargue nuevamente la página o contacte con el desarrollador del sistema.",
                    duration: 5000,
                });
            }

        } catch (err) {
            toast.error("Error al analizar las estadísticas", {
                description: "Intente nuevamente en unos minutos, si el problema persiste cargue nuevamente la página o contacte con el desarrollador del sistema.",
                duration: 5000,
            });
        } finally {
            await handleGeneralStats(null);
            await handleTopStats()
            setLoadingAPI(false);
        }
    };

    async function handleGeneralStats(chatGroupId: string | null) {
        setLoading(true);
        try {
            const result = await getGeneralStatisticsAction(chatGroupId);
            if (result.success) {
                setGeneralStats(result.data || []);
            } else {
                toast.error("Error desconocido.", {
                    description: "Cargue nuevamente la página.",
                    duration: 5000,
                });
            }
        } catch (err) {
            toast.error("Error desconocido.", {
                description: "Cargue nuevamente la página.",
                duration: 5000,
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleTopStats() {
        try {
            const analyzedResult = await getNumberStatsAction();
            if (analyzedResult.success) {
                if(analyzedResult.data){
                    setTopStats(analyzedResult?.data);
                }else{
                    toast.error("Error desconocido.", {
                        description: "Cargue nuevamente la página.",
                        duration: 5000,
                    });
                    console.log(analyzedResult.error)
                }
            } else {
                toast.error("Error desconocido.", {
                    description: "Cargue nuevamente la página.",
                    duration: 5000,
                });
                console.log(analyzedResult.error)
            }
        } catch (err) {
            toast.error("Error desconocido.", {
                description: "Cargue nuevamente la página.",
                duration: 5000,
            });
            console.error(err);
        }finally {
            setLoadingTop(false);
        }
    }

    async function handleExcel() {
        setLoadingExcel(true);
        try{
            const excel_stats = await convertStatsAction(generalStats);
            const buffer = await createExcel(currentUser, excel_stats, null);
            const blob = new Blob([buffer]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Estadisticas-NoVaMas.xlsx";
            a.click();
            URL.revokeObjectURL(url);
        }catch (e) {
            toast.error("Error desconocido al crear el excel.", {
                description: "Intente nuevamente.",
                duration: 5000,
            });
        }

        setLoadingExcel(false);
    }

    async function handleChatGroupId() {
        setLoading(true);
        try {
            const result = await getGroupNamesAction();
            if (result.success) {
                setAvailableChatGroups(result.data || []);
            } else {
                toast.error("Error desconocido al obtener los grupos.", {
                    description: "Intente nuevamente.",
                    duration: 5000,
                });
            }
        } catch (err) {
            toast.error("Error desconocido al obtener los grupos.", {
                description: "Intente nuevamente.",
                duration: 5000,
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGeneralStats(null);
    }, []);

    useEffect(() => {
        handleTopStats();
    }, []);


    const handleTabChange = async (value: string) => {
        setSelectedGroup(value);
        setSelectedChatGroup({id: "", name: "", startDate: new Date()})
        setError(null);

        if (value === "grupales") {
            await handleChatGroupId();
        } else if (value === "publicas") {
            await handleGeneralStats("");
        } else {
            await handleGeneralStats(null);
        }
    };

    const handleSelectChange = async (id: string, name: string, startDate: Date) => {
        setSelectedChatGroup({id: id, name: name, startDate: startDate});
        await handleGeneralStats(id);
    };

    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto max-w-7xl px-4 py-4 lg:px-8 lg:py-8">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al dashboard
                        </Button>
                    </Link>

                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8">Estadísticas</h1>

                    {/* Stats Summary Bar */}
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="flex flex-col sm:flex-row gap-6 flex-1">
                            {/* Analyzed Stat */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100">
                                    <TrendingUp className="h-7 w-7 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Sesiones analizadas</p>
                                    {loadingTop ? (
                                        <div className="flex gap-1 mt-1">
                                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-100" />
                                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-200" />
                                        </div>
                                    ) : (
                                        <p className="text-3xl font-bold text-slate-900">{topStats.analyzedTrue}</p>
                                    )}
                                </div>
                            </div>

                            {/* Pending Stat */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100">
                                    <Clock className="h-7 w-7 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Sesiones por analizar</p>
                                    {loadingTop ? (
                                        <div className="flex gap-1 mt-1">
                                            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce delay-100" />
                                            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce delay-200" />
                                        </div>
                                    ) : (
                                        <p className="text-3xl font-bold text-slate-900">{topStats.analyzedFalse}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <Button
                            size="lg"
                            onClick={handlePostStats}
                            disabled={topStats.analyzedFalse === 0 || loadingAPI}
                            className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-sm transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            {loadingAPI && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Analizar sesiones
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                {!loading && generalStats.length === 0 && selectedGroup === "todas" ? (
                    <EmptyState/>
                ) : (
                    <Tabs value={selectedGroup} onValueChange={handleTabChange} className="">
                        {/* Navigation Tabs */}
                        <TabsList className="inline-flex w-full sm:w-auto h-12 items-center justify-start rounded-xl bg-slate-100 p-1">
                            <TabsTrigger
                                value="todas"
                                className="rounded-lg px-6 py-2 text-sm font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                            >
                                Todas las sesiones
                            </TabsTrigger>
                            <TabsTrigger
                                value="grupales"
                                className="rounded-lg px-6 py-2 text-sm font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                            >
                                Sesiones grupales
                            </TabsTrigger>
                            <TabsTrigger
                                value="publicas"
                                className="rounded-lg px-6 py-2 text-sm font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                            >
                                Sesiones públicas
                            </TabsTrigger>
                        </TabsList>

                        {/* Tab: Todas */}
                        <TabsContent value="todas" className="space-y-8 mt-8">
                            {loading ? (
                                <StatisticSkeleton/>
                            ) : (
                                <>
                                    <StatisticsCharts generalStats={generalStats}/>
                                    <div className="flex justify-center pt-6">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={handleExcel}
                                            disabled={loadingExcel}
                                            className="h-14 px-8 py-6 text-lg border-slate-300 hover:border-slate-400 hover:bg-slate-50 font-medium rounded-2xl"
                                        >
                                            {loadingExcel ? (
                                                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                            ) : (
                                                <Download className="mr-3 h-5 w-5" />
                                            )}
                                            Exportar las estadísticas a Excel
                                        </Button>
                                    </div>

                                </>
                            )}
                        </TabsContent>

                        {/* Tab: Grupales */}
                        <TabsContent value="grupales" className="space-y-8 mt-8">
                            <div className="">
                                <Select
                                    value={selectedChatGroup.id}
                                    onValueChange={(value) => {
                                        const group = availableChatGroups.find(g => g.id === value);
                                        if (group) {
                                            handleSelectChange(group.id, group.name, group.startDate);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="h-12 w-full rounded-xl border-slate-300 bg-white text-sm font-medium hover:border-slate-400">
                                        <SelectValue placeholder="Seleccionar sesión grupal"/>
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[150px] overflow-y-auto">
                                        {availableChatGroups.map((group) => (
                                            <SelectItem key={group.id} value={group.id}>
                                                {group.name} - {group.startDate.getDate()}/{group.startDate.getMonth() + 1}/{group.startDate.getFullYear()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {!selectedChatGroup.id ? (
                                <EmptyStateGroupStats/>
                            ) : loading ? (
                                <StatisticSkeleton/>
                            ) : (
                                <>
                                    {generalStats.length > 0 ? (
                                        <>
                                            <StatisticsCharts generalStats={generalStats}/>
                                            <div className="flex justify-center pt-6">
                                                <Link href={`/statistics/${selectedChatGroup.id}`}>
                                                    <Button
                                                        variant="outline"
                                                        size="lg"
                                                        disabled={loadingAPI || loadingExcel}
                                                        className="h-14 px-8 py-6 text-lg border-slate-300 hover:border-slate-400 hover:bg-slate-50 font-medium rounded-2xl"
                                                    >
                                                        Ver conversaciones de {selectedChatGroup.name}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </>
                                    ) : (
                                        <EmptyState />
                                    )}
                                </>
                            )}
                        </TabsContent>

                        {/* Tab: Públicas */}
                        <TabsContent value="publicas" className="space-y-8 mt-8">
                            {loading ? (
                                <StatisticSkeleton/>
                            ) : generalStats.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <StatisticsCharts generalStats={generalStats}/>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </main>
        </div>
    );
}