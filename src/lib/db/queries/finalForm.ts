import {FinalForm} from "@/types/statistics";
import {db} from "@/db";
import {finalForm} from "@/db/schema";
import {desc, eq} from "drizzle-orm";

export async function getFinalFormByChatId(id: string): Promise<FinalForm|null> {
    try {
        const formResult = await db
            .select({
                assistantDesign: finalForm.assistantDesign,
                assistantPurpose: finalForm.assistantPurpose,
                assistantResponses: finalForm.assistantResponses,
                userFriendly: finalForm.userFriendly,
                usefulToUnderstandRisks: finalForm.usefulToUnderstandRisks,
                average: finalForm.average,
            })
            .from(finalForm)
            .where(eq(finalForm.chatId, id))
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

export async function getAllFinalForms() {
    try {
        const result = await db
            .select()
            .from(finalForm)
            .orderBy(desc(finalForm.createdAt));

        return result
    } catch (error) {
        console.error("Error fetching stats by chat id:", error)
        throw new Error("Failed to fetch stats by chat id")
    }
}