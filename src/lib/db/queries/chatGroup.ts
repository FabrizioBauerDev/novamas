import { db } from "@/db"
import { chatGroups, users, chatGroupMembers } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

// Obtener todos los ChatGroups con información del creador, ordenados por startDate
export async function getAllChatGroups() {
  try {
    const result = await db
      .select({
        id: chatGroups.id,
        creatorId: chatGroups.creatorId,
        name: chatGroups.name,
        slug: chatGroups.slug,
        description: chatGroups.description,
        password: chatGroups.password,
        startDate: chatGroups.startDate,
        endDate: chatGroups.endDate,
        createdAt: chatGroups.createdAt,
        updatedAt: chatGroups.updatedAt,
        creatorName: users.name,
      })
      .from(chatGroups)
      .leftJoin(users, eq(chatGroups.creatorId, users.id))
      .orderBy(desc(chatGroups.startDate))

    return result
  } catch (error) {
    console.error("Error fetching chat groups:", error)
    throw new Error("Failed to fetch chat groups")
  }
}

// Obtener un ChatGroup por ID con información del creador y participantes
export async function getChatGroupById(id: string) {
  try {
    // Obtener información básica del grupo
    const groupResult = await db
      .select({
        id: chatGroups.id,
        creatorId: chatGroups.creatorId,
        name: chatGroups.name,
        slug: chatGroups.slug,
        description: chatGroups.description,
        password: chatGroups.password,
        startDate: chatGroups.startDate,
        endDate: chatGroups.endDate,
        createdAt: chatGroups.createdAt,
        updatedAt: chatGroups.updatedAt,
        creatorName: users.name,
      })
      .from(chatGroups)
      .leftJoin(users, eq(chatGroups.creatorId, users.id))
      .where(eq(chatGroups.id, id))
      .limit(1)

    const group = groupResult[0]
    if (!group) {
      return null
    }

    // Obtener participantes del grupo
    const membersResult = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        joinedAt: chatGroupMembers.createdAt,
      })
      .from(chatGroupMembers)
      .innerJoin(users, eq(chatGroupMembers.userId, users.id))
      .where(eq(chatGroupMembers.chatGroupId, id))

    // Combinar la información del grupo con sus participantes
    return {
      ...group,
      participants: membersResult
    }
  } catch (error) {
    console.error("Error fetching chat group by ID:", error)
    throw new Error("Failed to fetch chat group")
  }
}
