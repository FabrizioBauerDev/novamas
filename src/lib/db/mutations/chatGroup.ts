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

// Actualizar la descripción de un ChatGroup
export async function updateChatGroupDescription(id: string, description: string) {
  try {
    const result = await db
      .update(chatGroups)
      .set({ 
        description: description || null,
        updatedAt: new Date()
      })
      .where(eq(chatGroups.id, id))
      .returning()

    if (result.length === 0) {
      throw new Error("Chat group not found")
    }

    return result[0]
  } catch (error) {
    console.error("Error updating chat group description:", error)
    throw new Error("Failed to update chat group description")
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
    
    // Detectar error de foreign key constraint (hay sesiones relacionadas)
    // El error puede estar en error.code, error.cause.code o en el mensaje
    const errorWithCode = error as { code?: string; cause?: { code?: string; message?: string } }
    const errorCode = errorWithCode.code || errorWithCode.cause?.code
    const errorMessage = error instanceof Error ? error.message : ''
    const causeMessage = errorWithCode.cause?.message || ''
    
    if (errorCode === '23503' || 
        errorMessage.includes('foreign key constraint') || 
        causeMessage.includes('foreign key constraint')) {
      throw new Error("FOREIGN_KEY_CONSTRAINT")
    }
    
    throw new Error("Failed to delete chat group")
  }
}
