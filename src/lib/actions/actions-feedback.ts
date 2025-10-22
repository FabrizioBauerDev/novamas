"use server"

import {getFeedBackByChatId} from "@/lib/db/queries/feedBack";

export async function getFeedBackAction(chatId: string) {
    try {
        const feedBackResult = await getFeedBackByChatId(chatId)
        return { success: true, data: feedBackResult }
    } catch (error) {
        console.error("Error in getFeedBackAction:", error)
        return { success: false, error: "Error al cargar la feedback" }
    }
}