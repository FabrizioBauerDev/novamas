"use server"

import { getAllChatGroups, getChatGroupById } from "@/lib/db/queries/chatGroup"
import { deleteChatGroupById } from "@/lib/db/mutations/chatGroup"
import { revalidatePath } from "next/cache"

// Server Action para obtener todos los ChatGroups
export async function getChatGroupsAction() {
  try {
    const groups = await getAllChatGroups()
    return { success: true, data: groups }
  } catch (error) {
    console.error("Error in getChatGroupsAction:", error)
    return { success: false, error: "Error al cargar las sesiones grupales" }
  }
}

// Server Action para obtener un ChatGroup por ID
export async function getChatGroupByIdAction(id: string) {
  try {
    const group = await getChatGroupById(id)
    return { success: true, data: group }
  } catch (error) {
    console.error("Error in getChatGroupByIdAction:", error)
    return { success: false, error: "Error al cargar la sesión grupal" }
  }
}

// Server Action para eliminar un ChatGroup
export async function deleteChatGroupAction(id: string) {
  try {
    await deleteChatGroupById(id)
    // Revalidar la página para actualizar los datos
    revalidatePath("/chatgroup")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteChatGroupAction:", error)
    return { success: false, error: "Error al eliminar la sesión grupal" }
  }
}
