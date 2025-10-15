import {db} from "@/db";
import {evaluationForms, statistics} from "@/db/schema";
import {desc, eq} from "drizzle-orm";
import {EvaluationFormResult} from "@/types/statistics";

export async function getEvaluationFormByChatId(id: string): Promise<EvaluationFormResult|null> {
    try {
        const formResult = await db
            .select({
                id: evaluationForms.id,
                gender: evaluationForms.gender,
                age: evaluationForms.age,
                onlineGaming: evaluationForms.onlineGaming,
                couldntStop: evaluationForms.couldntStop,
                personalIssues: evaluationForms.personalIssues,
                triedToQuit: evaluationForms.triedToQuit,
                score: evaluationForms.score,
                createdAt: evaluationForms.createdAt,
            })
            .from(evaluationForms)
            .where(eq(evaluationForms.id, id))
            .limit(1)

        const evaluationForm = formResult[0]
        if (!evaluationForm) {
            return null
        }

        return evaluationForm;
    } catch (error) {
        console.error("Error fetching evaluation form by ID:", error)
        throw new Error("Failed to fetch evaluation form by ID")
    }
}

export async function getEvaluationFormByGroupId(group_id: string): Promise<EvaluationFormResult[]|null> {
    try {
        const formResult = await db
            .select({
                id: evaluationForms.id,
                gender: evaluationForms.gender,
                age: evaluationForms.age,
                onlineGaming: evaluationForms.onlineGaming,
                couldntStop: evaluationForms.couldntStop,
                personalIssues: evaluationForms.personalIssues,
                triedToQuit: evaluationForms.triedToQuit,
                score: evaluationForms.score,
                createdAt: evaluationForms.createdAt,
            })
            .from(evaluationForms)
            .innerJoin(statistics, eq(evaluationForms.id, statistics.chatId))
            .where(eq(statistics.chatGroupId, group_id))
            .orderBy(desc(statistics.createdAt))

        if (!formResult) {
            return null
        }

        return formResult;
    } catch (error) {
        console.error("Error fetching evaluation form by ID:", error)
        throw new Error("Failed to fetch evaluation form by ID")
    }
}