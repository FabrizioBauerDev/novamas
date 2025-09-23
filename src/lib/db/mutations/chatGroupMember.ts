import { db } from "@/db"
import { chatGroupMembers, type NewChatGroupMember } from "@/db/schema"
import { eq, and } from "drizzle-orm"

// Añadir un participante a un grupo
export async function addChatGroupMember(data: {
  userId: string;
  chatGroupId: string;
}) {
  try {
    const newMember: NewChatGroupMember = {
      userId: data.userId,
      chatGroupId: data.chatGroupId,
    };

    const result = await db
      .insert(chatGroupMembers)
      .values(newMember)
      .returning();

    if (result.length === 0) {
      throw new Error("Failed to add member to chat group");
    }

    return result[0];
  } catch (error) {
    console.error("Error adding chat group member:", error);
    throw new Error("Failed to add member to chat group");
  }
}

// Eliminar un participante de un grupo
export async function removeChatGroupMember(userId: string, chatGroupId: string) {
  try {
    const result = await db
      .delete(chatGroupMembers)
      .where(
        and(
          eq(chatGroupMembers.userId, userId),
          eq(chatGroupMembers.chatGroupId, chatGroupId)
        )
      )
      .returning();

    if (result.length === 0) {
      throw new Error("Member not found in chat group");
    }

    return result[0];
  } catch (error) {
    console.error("Error removing chat group member:", error);
    throw new Error("Failed to remove member from chat group");
  }
}

// Verificar si un usuario es miembro de un grupo
export async function isChatGroupMember(userId: string, chatGroupId: string) {
  try {
    const result = await db
      .select()
      .from(chatGroupMembers)
      .where(
        and(
          eq(chatGroupMembers.userId, userId),
          eq(chatGroupMembers.chatGroupId, chatGroupId)
        )
      )
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("Error checking chat group membership:", error);
    throw new Error("Failed to check chat group membership");
  }
}