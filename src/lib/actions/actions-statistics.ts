"use server"

import {
    getGeneralStats,
    getNumberStats,
    getStatsByChatGroupId,
    getStatsByChatId
} from "@/lib/db/queries/statistic";

export async function getGeneralStatisticsAction(chatGroupId: string|null) {
    try {
        const generalStats = await getGeneralStats(chatGroupId)
        return { success: true, data: generalStats }
    } catch (error) {
        console.error("Error in getGeneralStatisticsAction:", error)
        return { success: false, error: "Error al cargar las estadisticas generales" }
    }
}

export async function getStatsbyChatGroupIdAction(chatGroupId: string) {
    try {
        const statsByChatGroupId = await getStatsByChatGroupId(chatGroupId)
        return { success: true, data: statsByChatGroupId }
    } catch (error) {
        console.error("Error in getStatsbySlugAction:", error)
        return { success: false, error: "Error al cargar las estadisticas por slug" }
    }
}

export async function getStatsbyIdAction(id: string) {
    try {
        const statsById = await getStatsByChatId(id)
        return { success: true, data: statsById }
    } catch (error) {
        console.error("Error in getStatsbyIdAction:", error)
        return { success: false, error: "Error al cargar las estadisticas por id" }
    }
}

export async function getNumberStatsAction(){
    try{
        const result = await getNumberStats()
        return {success: true, data: result}
    }catch (error){
        console.error("Error in getNumberStatsAction:", error)
        return { success: false, error: "Error al cargar las estadisticas de arriba" }
    }
}