import { db } from "@/db"
import { users, chatGroupMembers } from "@/db/schema"
import { eq, and, ilike, notExists } from "drizzle-orm"

// Buscar usuarios por nombre o email
export async function searchUsers(searchTerm: string, limit: number = 10) {
  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(
        and(
          eq(users.status, "ACTIVO"),
          ilike(users.name, `%${searchTerm}%`)
        )
      )
      .limit(limit)

    return result
  } catch (error) {
    console.error("Error searching users:", error)
    throw new Error("Failed to search users")
  }
}

// Obtener usuarios que NO son participantes de un grupo específico
export async function searchUsersNotInGroup(chatGroupId: string, searchTerm: string, limit: number = 10) {
  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(
        and(
          eq(users.status, "ACTIVO"),
          ilike(users.name, `%${searchTerm}%`),
          notExists(
            db
              .select()
              .from(chatGroupMembers)
              .where(
                and(
                  eq(chatGroupMembers.chatGroupId, chatGroupId),
                  eq(chatGroupMembers.userId, users.id)
                )
              )
          )
        )
      )
      .limit(limit)

    return result
  } catch (error) {
    console.error("Error searching users not in group:", error)
    throw new Error("Failed to search users not in group")
  }
}

// Obtener participantes de un grupo
export async function getChatGroupMembers(chatGroupId: string) {
  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        joinedAt: chatGroupMembers.createdAt,
      })
      .from(chatGroupMembers)
      .innerJoin(users, eq(chatGroupMembers.userId, users.id))
      .where(eq(chatGroupMembers.chatGroupId, chatGroupId))

    return result
  } catch (error) {
    console.error("Error fetching chat group members:", error)
    throw new Error("Failed to fetch chat group members")
  }
}