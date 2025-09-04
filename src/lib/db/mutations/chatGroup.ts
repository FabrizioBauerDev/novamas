import { db } from "@/db"
import { chatGroups } from "@/db/schema"
import { eq } from "drizzle-orm"

// Eliminar un ChatGroup por ID
export async function deleteChatGroupById(id: string) {
  try {
    const result = await db
      .delete(chatGroups)
      .where(eq(chatGroups.id, id))
      .returning()

    if (result.length === 0) {
      throw new Error("Chat group not found")
    }

    return result[0]
  } catch (error) {
    console.error("Error deleting chat group:", error)
    throw new Error("Failed to delete chat group")
  }
}
