"use server"

import {
    getEvaluationFormByChatId,
    getEvaluationFormByGroupId
} from "@/lib/db/queries/evaluationForm";

export async function getEvaluationFormByIdAction(id: string) {
    try {
        const evaluationForm = await getEvaluationFormByChatId(id)
        return { success: true, data: evaluationForm }
    } catch (error) {
        console.error("Error in getEvaluationFormByIdAction:", error)
        return { success: false, error: "Error al cargar la evaluacion inicial" }
    }
}

export async function getEvaluationFormByGroupIdAction(groud_id: string) {
    try {
        const evaluationForm = await getEvaluationFormByGroupId(groud_id)
        return { success: true, data: evaluationForm }
    } catch (error) {
        console.error("Error in getEvaluationFormByGroupIdAction:", error)
        return { success: false, error: "Error al cargar la evaluacion inicial por GroupId" }
    }
}