"use client"
import { useEffect, useState } from "react";
import { getGeneralStatisticsAction, getNumberStatsAction } from "@/lib/actions/actions-statistics";
import { GeneralStats } from "@/types/statistics";
import { TopStatistics } from "@/components/statistics/TopStatistics";
import { EmptyStateGroupStats } from "@/components/statistics/EmptyStateGroupStats";
import { StatisticSkeleton } from "@/components/statistics/StatisticSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatisticsCharts } from "./StatisticCharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {getGroupNamesAction} from "@/lib/actions/actions-chatgroup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {EmptyState} from "@/components/statistics/EmptyState";


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
    const [error, setError] = useState<string | null>(null);

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

    // Cargar estadísticas generales y top stats al montar
    useEffect(() => {
        handleGeneralStats(null);
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

                    <TopStatistics analyzedTrue={topStats.analyzedTrue} analyzedFalse={topStats.analyzedFalse}/>
                </div>
                {!loading && generalStats.length == 0 ? (<EmptyState/>) :
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
                                {loading ? <StatisticSkeleton/> : <StatisticsCharts generalStats={generalStats}/>}
                                <div className="flex justify-center pt-6">
                                        <Button
                                            variant="outline"
                                            size="lg"
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
                                        <StatisticsCharts generalStats={generalStats}/>
                                        <div className="flex justify-center pt-6">
                                            <Link href={`/statistics/${selectedChatGroup.id}`}>
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    className="border-slate-300 bg-white px-8 py-6 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow-md"
                                                >
                                                    Ver todas las conversaciones del {selectedChatGroup.name}
                                                </Button>
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </TabsContent>

                            {/* Tab: Públicas */}
                            <TabsContent value="publicas" className="space-y-10">
                                {loading ? <StatisticSkeleton/> : <StatisticsCharts generalStats={generalStats}/>}
                            </TabsContent>
                        </Tabs>)}
            </main>
        </div>
    );
}
