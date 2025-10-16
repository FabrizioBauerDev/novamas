"use client"
import { useEffect, useState } from "react";
import { getGeneralStatisticsAction, getNumberStatsAction } from "@/lib/actions/actions-statistics";
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


export function GeneralView() {
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
    const [loadingAPI, setLoadingAPI] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePostStats = async () => {
        setLoadingAPI(true);
        try {
            const res = await fetch("/api/statistics", { method: "POST" });
            const data = await res.json();

            if (res.ok) {
                toast.success("Se analizaron correctamente las estadísticas", {
                    description: data.message || "Las estadísticas se crearon correctamente.",
                    duration: 5000,
                });
            } else {
                toast.error("Error al analizar las estadísticas", {
                    description: data.error || "Ocurrió un error.",
                    duration: 5000,
                });
            }
        } catch (err: any) {
            toast.error("Error al analizar las estadísticas", {
                description: err.message || "Error de conexión",
                duration: 5000,
            });
        } finally {
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
                setError(result.error || "Error desconocido");
            }
        } catch (err) {
            setError("Error al cargar las estadísticas");
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
                    setError("Ocurrió un problema al calcular la cantidad de sesiones")
                }
            } else {
                setError(analyzedResult.error || "Error desconocido");
            }
        } catch (err) {
            setError("Error al cargar estadísticas de conteo");
            console.error(err);
        }finally {
            setLoadingTop(false);
        }
    }

    async function handleChatGroupId() {
        setLoading(true);
        try {
            const result = await getGroupNamesAction();
            if (result.success) {
                setAvailableChatGroups(result.data || []);
            } else {
                setError(result.error || "Error desconocido");
            }
        } catch (err) {
            setError("Error al cargar los group name");
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
        <div className="min-h-screen bg-slate-50">
            <main className="container mx-auto max-w-7xl px-8 py-12">
                <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <h2 className="text-5xl font-bold text-slate-900">Estadísticas</h2>

                    <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm border border-slate-200">
                            {loadingTop ? (
                                <div className="flex space-x-1">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></span>
                                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-300"></span>
                                </div>
                            ) : (
                                <span className="text-lg font-bold text-blue-600">{topStats.analyzedTrue}</span>
                            )}
                            <span className="text-sm text-slate-600">Sesiones analizadas</span>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm border border-slate-200">
                            {loadingTop ? (
                                <div className="flex space-x-1">
                                    <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce delay-150"></span>
                                    <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce delay-300"></span>
                                </div>
                            ) : (
                                <span className="text-lg font-bold text-amber-600">{topStats.analyzedFalse}</span>
                            )}
                            <span className="text-sm text-slate-600">Sesiones por analizar</span>
                        </div>


                        <Button
                            size="lg"
                            onClick={}
                            disabled={topStats.analyzedFalse === 0 || loadingAPI}
                            className="h-auto rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-3 text-base font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            Analizar
                        </Button>
                    </div>
                </div>
                {!loading && generalStats.length == 0 && selectedGroup=="todas" ? (<EmptyState/>) :
                    (
                        <Tabs value={selectedGroup} onValueChange={handleTabChange} className="mt-12">
                            <TabsList
                                className="mx-auto mb-10 block rounded-xl bg-white p-1.5 shadow-sm gap-2.5 text-center w-auto h-12">
                                <TabsTrigger
                                    value="todas"
                                    className="rounded-lg px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                                >
                                    Todas las sesiones
                                </TabsTrigger>
                                <TabsTrigger
                                    value="grupales"
                                    className="rounded-lg px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                                >
                                    Sesiones grupales
                                </TabsTrigger>
                                <TabsTrigger
                                    value="publicas"
                                    className="rounded-lg px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                                >
                                    Sesiones públicas
                                </TabsTrigger>
                            </TabsList>

                            {/* Tab: Todas */}
                            <TabsContent value="todas" className="space-y-10">
                                {loading ? <StatisticSkeleton/> :
                                    <StatisticsCharts generalStats={generalStats}/>}
                                <div className="flex justify-center pt-6">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            disabled={loadingAPI}
                                            className="border-slate-300 bg-white px-8 py-6 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow-md"
                                        >
                                            Exportar las estadísticas a Excel
                                        </Button>
                                </div>
                            </TabsContent>

                            {/* Tab: Grupales */}
                            <TabsContent value="grupales" className="space-y-10">
                                <Select
                                    value={selectedChatGroup.id}
                                    onValueChange={(value) => {
                                        const group = availableChatGroups.find(g => g.id === value);
                                        if (group) {
                                            handleSelectChange(group.id, group.name, group.startDate);
                                        }
                                    }}
                                >
                                    <SelectTrigger
                                        className="h-14 w-full rounded-xl border-slate-300 bg-white text-base shadow-sm">
                                        <SelectValue placeholder="Elegir sesión grupal"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableChatGroups.map((group) => (
                                            <SelectItem key={group.id} value={group.id}>
                                                {group.name + " - " + group.startDate.getDate() + "/" + group.startDate.getMonth() + "/" + group.startDate.getFullYear()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {!selectedChatGroup.id ? (
                                    <EmptyStateGroupStats/>
                                ) : loading ? (
                                    <StatisticSkeleton/>
                                ) : (
                                    <>
                                        {generalStats.length > 0 ? (
                                            <><StatisticsCharts generalStats={generalStats}/>
                                                <div className="flex justify-center pt-6">
                                                    <Link href={`/statistics/${selectedChatGroup.id}`}>
                                                        <Button
                                                            variant="outline"
                                                            size="lg"
                                                            disabled={loadingAPI}
                                                            className="border-slate-300 bg-white px-8 py-6 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow-md"
                                                        >
                                                            Ver todas las conversaciones del {selectedChatGroup.name}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </>
                                        ): <EmptyState />
                                        }

                                    </>
                                )}
                            </TabsContent>

                            {/* Tab: Públicas */}
                            <TabsContent value="publicas" className="space-y-10">
                                {loading ? <StatisticSkeleton/> : generalStats.length==0? <EmptyState /> :
                                <StatisticsCharts generalStats={generalStats}/>}
                            </TabsContent>
                        </Tabs>)}
            </main>
        </div>
    );
}
