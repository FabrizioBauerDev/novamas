import { db } from "@/db"
import { chatGroups, type NewChatGroup } from "@/db/schema"
import { eq } from "drizzle-orm"
import { encryptMessage } from "@/lib/crypto/encryption"

// Crear un nuevo ChatGroup
export async function createChatGroup(data: {
  creatorId: string;
  name: string;
  slug: string;
  description?: string;
  password: string;
  startDate: Date;
  endDate: Date;
}) {
  try {
    // Encriptar la contraseña antes de guardarla
    const encryptedPassword = encryptMessage(data.password);

    const newChatGroup: NewChatGroup = {
      creatorId: data.creatorId,
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      password: encryptedPassword,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    const result = await db
      .insert(chatGroups)
      .values(newChatGroup)
      .returning();

    if (result.length === 0) {
      throw new Error("Failed to create chat group");
    }

    return result[0];
  } catch (error) {
    console.error("Error creating chat group:", error);
    throw new Error("Failed to create chat group");
  }
}

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
