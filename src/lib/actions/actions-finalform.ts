"use server"

import {getFinalFormByChatId} from "@/lib/db/queries/finalForm";
import { finalFormSchema } from "@/schema/zodSchemas";
import { FinalFormData } from "@/types/types";
import {createFinalForm} from "@/lib/db/mutations/finalForm";

export async function getFinalFormAction(chatId: string) {
    try {
        const finalFormResult = await getFinalFormByChatId(chatId)
        return { success: true, data: finalFormResult }
    } catch (error) {
        console.error("Error in getFinalFormAction:", error)
        return { success: false, error: "Error al cargar la evaluacion final" }
    }
}

// Server Action para crear un FinalForm
export async function createFinalFormAction(formData: FinalFormData) {
    try {
        // Validar los datos con Zod
        const validatedFields = finalFormSchema.safeParse(formData);
        if (!validatedFields.success) {
            console.log("hubo un error en el zod");
            const errors = validatedFields.error.errors.map(err => err.message);
            console.log(errors)
            return { success: false, error: errors.join(". ") };
        }

        const { chatId, assistantDesign, assistantResponses, assistantPurpose, userFriendly, usefulToUnderstandRisks, average } = validatedFields.data;

        // Crear el FinalForm
        const newFinalForm = await createFinalForm(chatId, assistantDesign, assistantResponses, assistantPurpose, userFriendly, usefulToUnderstandRisks, average);
        return { success: true, data: newFinalForm };
    } catch (error) {
        console.error("Error in createFinalFormAction:", error);
        return { success: false, error: "Error al crear el final form" };
    }
}
