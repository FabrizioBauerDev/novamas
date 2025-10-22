"use client"
import { useEffect, useState } from "react";
import { getStatsbyIdAction } from "@/lib/actions/actions-statistics";
import { EvaluationFormResult, Statistics, FinalForm } from "@/types/statistics";
import { getEvaluationFormByIdAction } from "@/lib/actions/actions-evaluationform";
import { SlugStatisticSkeleton } from "@/components/statistics/SlugStatisticSkeleton";
import { ConversationDetailHeader } from "@/components/statistics/ConversationHeader";
import { getGroupConversationByChatSessionAction } from "@/lib/actions/actions-chatgroup";
import { StatisticsTab } from "./StatisticsTab";
import { EvaluationFormTab } from "@/components/statistics/EvaluationFormTab";
import {getFinalFormAction} from "@/lib/actions/actions-finalform";
import {FinalFormTab} from "@/components/statistics/FinalFormTab";
import {ArrowLeft, BarChart3} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {FeedBack} from "@/types/types";
import {getFeedBackAction} from "@/lib/actions/actions-feedback";
import {FeedBackTab} from "@/components/statistics/FeedBackTab";

interface ConversationViewProps {
    id?: string;
}

export default function ConversationView({ id = "" }: ConversationViewProps) {
    const [activeTab, setActiveTab] = useState<"stats" | "initial" | "final" | "feedback">("stats");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<Statistics | null>(null);
    const [evaluationForm, setEvaluationForm] = useState<EvaluationFormResult | null>(null);
    const [finalForm, setFinalForm] = useState<FinalForm | null>(null);
    const [feedBack, setFeedBack] = useState<FeedBack | null>(null);
    const [conversationInfo, setConversationInfo] = useState<{ id: string; name: string; startDate: Date }>({
        id: "",
        name: "",
        startDate: new Date(),
    });

    async function handleFeedBack(id: string) {
        try {
            const result = await getFeedBackAction(id);
            if (result.success) {
                if(result.data){
                    setFeedBack(result.data);
                }else{
                    setFeedBack(null);
                }
            } else {
                setError(result.error || "Error desconocido");
            }
        } catch (err) {
            setError("Error al cargar feedback");
            console.error(err);
        }
    }

    async function handleFinalForm(id: string) {
        try {
            const result = await getFinalFormAction(id);
            if (result.success) {
                if(result.data){
                    setFinalForm(result.data);
                }else{
                    setFinalForm(null);
                }
            } else {
                setError(result.error || "Error desconocido");
            }
        } catch (err) {
            setError("Error al cargar las estadísticas");
            console.error(err);
        }
    }

    async function handleStats(id: string) {
        try {
            const result = await getStatsbyIdAction(id);
            if (result.success) {
                setStats(result.data || null);
            } else {
                setError(result.error || "Error desconocido");
            }
        } catch (err) {
            setError("Error al cargar las estadísticas");
            console.error(err);
        }
    }

    async function handleEvaluationForm(id: string) {
        try {
            const result = await getEvaluationFormByIdAction(id);
            if (result.success) {
                setEvaluationForm(result.data || null);
            } else {
                setError(result.error || "Error desconocido");
            }
        } catch (err) {
            setError("Error al cargar las estadísticas");
            console.error(err);
        }
    }

    async function handleConversationInfo(id: string) {
        try {
            const result = await getGroupConversationByChatSessionAction(id);
            if (result.success) {
                if (result.data) {
                    setConversationInfo({
                        id: result.data.id,
                        name: result.data.name,
                        startDate: result.data.startDate,
                    });
                } else {
                    setError(result.error || "Error desconocido");
                }
            } else {
                setError(result.error || "Error desconocido");
            }
        } catch (err) {
            setError("Error al cargar la información de la conversación");
            console.error(err);
        }
    }

    useEffect(() => {
        if (!id) {
            setError("El id de la conversacion no se paso bien");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                await Promise.all([
                    handleStats(id),
                    handleEvaluationForm(id),
                    handleFinalForm(id),
                    handleConversationInfo(id),
                    handleFeedBack(id),
                ]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);


    return (
        <div className="min-h-screen bg-slate-50">
            <main className="container mx-auto max-w-7xl px-8 py-6">
                <div className="mb-4">
                    <Link href={`/statistics/${conversationInfo.id}`}>
                        <Button variant="ghost" className="mb-4 gap-2 text-slate-600 hover:text-slate-900">
                            <ArrowLeft className="h-4 w-4" />
                            Volver a Conversaciones
                        </Button>
                    </Link>
                </div>
                {loading ? (
                    <SlugStatisticSkeleton />
                ) : (
                    <>
                <ConversationDetailHeader
                    groupName={conversationInfo.name}
                    createdAt={conversationInfo.startDate}
                />

                {/* Tabs */}
                <div className="mb-6 flex gap-2 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab("stats")}
                        className={`rounded-t-lg px-6 py-3 font-medium transition-colors ${
                            activeTab === "stats"
                                ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                    >
                        Estadísticas
                    </button>
                    <button
                        onClick={() => setActiveTab("initial")}
                        className={`rounded-t-lg px-6 py-3 font-medium transition-colors ${
                            activeTab === "initial"
                                ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                    >
                        Formulario Inicial
                    </button>
                    <button
                        onClick={() => setActiveTab("final")}
                        className={`rounded-t-lg px-6 py-3 font-medium transition-colors ${
                            activeTab === "final"
                                ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                    >
                        Formulario Final
                    </button>
                    <button
                        onClick={() => setActiveTab("feedback")}
                        className={`rounded-t-lg px-6 py-3 font-medium transition-colors ${
                            activeTab === "feedback"
                                ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                    >
                        FeedBack
                    </button>
                </div>

                {/* Content */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    {activeTab === "stats" && stats !== null && (
                        <StatisticsTab
                            summary={stats.summary}
                            amountMessages={stats.amountMessages}
                            minWordsPerMessage={stats.minWordsPerMessage}
                            maxWordsPerMessage={stats.maxWordsPerMessage}
                            mostFrequentSentiment={stats.mostFrequentSentiment}
                            hateSpeech={stats.hateSpeech}
                            ironic={stats.ironic}
                            changeTheme={stats.changeTheme}
                            betType={stats.betType}
                            positivePercentage={stats.positivePercentage}
                            negativePercentage={stats.negativePercentage}
                            neutralPercentage={stats.neutralPercentage}
                        />
                    )}

                    {activeTab === "initial" && evaluationForm !== null && (
                        <EvaluationFormTab formData={evaluationForm} />
                    )}

                    {activeTab === "final" && finalForm && <FinalFormTab finalForm={finalForm} />}
                    {activeTab === "final" && finalForm === null && <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-sm">
                        <div className="mb-4 rounded-full bg-slate-100 p-6">
                            <BarChart3 className="h-12 w-12 text-slate-400" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-slate-900">No hay un formulario final para mostrar</h3>
                        <p className="text-center text-slate-500">
                            El usuario decidió no completar el formulario final.
                        </p>
                    </div>}
                    {activeTab === "feedback" && feedBack && <FeedBackTab feedBack={feedBack} />}
                    {activeTab === "feedback" && feedBack === null && <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-sm">
                        <div className="mb-4 rounded-full bg-slate-100 p-6">
                            <svg
                                className={`w-6 h-6 "text-gray-300 fill-gray-300"
                                } transition-colors duration-150`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1"
                            ><path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-slate-900">No hay feedBack para mostrar</h3>
                        <p className="text-center text-slate-500">
                            El usuario decidió no completar el feedBack del asistente.
                        </p>
                    </div>}
                </div>
                    </>
                )}
            </main>
        </div>
    );
}
