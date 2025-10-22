"use server"
import {getUserById, getUsers} from "@/lib/db/queries/user";
import { updateProfileSchema } from "@/schema/zodSchemas";
import { UserFormData } from "@/types/types";
import {updateUser} from "@/lib/db/mutations/user";

export async function getUsersAction() {
    try {
        const result = await getUsers();
        return { success: true, data: result }
    } catch (error) {
        console.error("Error in getUsersAction:", error)
        return { success: false, error: "Error al cargar los usuarios" }
    }
}

export async function getUserByIdAction(id: string) {
    try {
        const result = await getUserById(id);
        return { success: true, data: result }
    } catch (error) {
        console.error("Error in getUserByIdAction:", error)
        return { success: false, error: "Error al cargar el usuario" }
    }
}

export async function updateUserAction(formData: UserFormData) {
    try {
        // Validar datos de entrada
        const validatedFields = updateProfileSchema.safeParse(formData);
        if (!validatedFields.success) {
            const errors = validatedFields.error.errors.map(err => err.message);
            return { success: false, error: errors.join(". ") };
        }
        const { id, name, image } = validatedFields.data;

        const user = updateUser(id, name, image);

        return { success: true, data: user };
    } catch (error) {
        console.error("Error in updateUserAction:", error);
        return { success: false, error: "Error al modificar al usuario" };
    }
}