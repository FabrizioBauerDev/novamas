import {db} from "@/db";
import {finalForm, NewFinalForm} from "@/db/schema";

export async function createFinalForm(chatId: string,
                                      assistantDesign: number,
                                      assistantPurpose: number,
                                      assistantResponses: number,
                                      userFriendly: number,
                                      usefulToUnderstandRisks: number,
                                      average: number,) {
    try {
        const newFinalForm: NewFinalForm = {
            chatId: chatId,
            assistantDesign: assistantDesign,
            assistantPurpose: assistantPurpose,
            assistantResponses: assistantResponses,
            userFriendly: userFriendly,
            usefulToUnderstandRisks: usefulToUnderstandRisks,
            average: average,
        };

        const result = await db
            .insert(finalForm)
            .values(newFinalForm)
            .returning();

        if (result.length === 0) {
            throw new Error("Failed to create final form");
        }

        return result[0];
    } catch (error) {
        console.error("Error creating final form:", error);
        throw new Error("Failed to create final form");
    }
}
