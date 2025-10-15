import {db} from "@/db";
import {chatSessions, evaluationForms, finalForm, statistics} from "@/db/schema";
import {desc, eq, isNotNull, isNull} from "drizzle-orm";
export async function getGeneralStats(chatGroupId: string | null) {
    try {
        let condition;

        if (chatGroupId === null || chatGroupId === undefined) {
            // Busca todas las estadisticas
            condition = undefined;
        } else if (chatGroupId === "") {
            // Busca sesiones publicas
            condition = isNull(statistics.chatGroupId);
        } else {
            // Busca estadisticas de un grupo en particular
            condition = eq(statistics.chatGroupId, chatGroupId);
        }

        const result = await db
            .select({
                betType: statistics.betType,
                gender: evaluationForms.gender,
                age: evaluationForms.age,
                score: evaluationForms.score,
                mostFrequentSentiment: statistics.mostFrequentSentiment,
                usefulToUnderstandRisks: finalForm.usefulToUnderstandRisks,
            })
            .from(statistics)
            .rightJoin(evaluationForms, eq(statistics.chatId, evaluationForms.id))
            .leftJoin(finalForm, eq(finalForm.chatId, evaluationForms.id))
            .where(condition);

        return result;
    } catch (error) {
        console.error("Error fetching general stats:", error);
        throw new Error("Failed to fetch general stats");
    }
}


export async function getStatsByChatGroupId(id: string) {
    try {
        const result = await db
            .select({
                id: statistics.id,
                chatId: statistics.chatId,
                chatGroupId: statistics.chatGroupId,
                summary: statistics.summary,
                betType: statistics.betType,
                amountMessages: statistics.amountMessages,
                minWordsPerMessage: statistics.minWordsPerMessage,
                maxWordsPerMessage: statistics.maxWordsPerMessage,
                hateSpeech: statistics.hateSpeech,
                ironic: statistics.ironic,
                positivePercentage: statistics.positivePercentage,
                negativePercentage: statistics.negativePercentage,
                neutralPercentage: statistics.neutralPercentage,
                mostFrequentSentiment: statistics.mostFrequentSentiment,
                changeTheme: statistics.changeTheme,
                createdAt: statistics.createdAt,
            })
            .from(statistics)
            .where(eq(statistics.chatGroupId, id))
            .orderBy(desc(statistics.createdAt));

        return result
    } catch (error) {
        console.error("Error fetching stats by chat slug:", error)
        throw new Error("Failed to fetch stats by chat slug")
    }
}

export async function getStatsByChatId(id: string) {
    try {
        const result = await db
            .select({
                id: statistics.id,
                chatId: statistics.chatId,
                summary: statistics.summary,
                betType: statistics.betType,
                amountMessages: statistics.amountMessages,
                minWordsPerMessage: statistics.minWordsPerMessage,
                maxWordsPerMessage: statistics.maxWordsPerMessage,
                hateSpeech: statistics.hateSpeech,
                ironic: statistics.ironic,
                positivePercentage: statistics.positivePercentage,
                negativePercentage: statistics.negativePercentage,
                neutralPercentage: statistics.neutralPercentage,
                mostFrequentSentiment: statistics.mostFrequentSentiment,
                changeTheme: statistics.changeTheme,
                createdAt: statistics.createdAt,
            })
            .from(statistics)
            .where(eq(statistics.chatId, id))
            .limit(1)
            .orderBy(desc(statistics.createdAt));

        return result[0]
    } catch (error) {
        console.error("Error fetching stats by chat id:", error)
        throw new Error("Failed to fetch stats by chat id")
    }
}

export async function getNumberStats() {
    try {
        const results = await db
            .select({
                analyzed: chatSessions.analyzed
            })
            .from(chatSessions)
            .where(isNotNull(chatSessions.sessionEndedAt))

        let analyzedTrue = 0;
        let analyzedFalse = 0;

        for (const result of results){
            if(result.analyzed){
                analyzedTrue++;
            }else{
                analyzedFalse++;
            }
        }

        return {analyzedTrue, analyzedFalse}
    } catch (error) {
        console.error("Error fetching general stats:", error)
        throw new Error("Failed to fetch general stats")
    }
}