import { db } from "@/db"
import {chatGroups, users, chatGroupMembers, chatSessions} from "@/db/schema"
import { eq, desc, and, lt, gt, ne } from "drizzle-orm"

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
        role: users.role,
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

// Obtener un ChatGroup por slug, priorizando sesiones no finalizadas
export async function getChatGroupBySlug(slug: string) {
  try {
    const now = new Date();
    
    // Primero buscar sesiones que no hayan finalizado (endDate > now)
    // Ordenadas por fecha de inicio para obtener la más próxima/actual
    const activeResult = await db
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
      .where(and(
        eq(chatGroups.slug, slug),
        gt(chatGroups.endDate, now) // Solo sesiones que no hayan finalizado
      ))
      .orderBy(chatGroups.startDate) // Ordenar por fecha de inicio
      .limit(1)

    // Si encontramos una sesión activa/próxima, devolverla
    if (activeResult.length > 0) {
      return activeResult[0];
    }

    // Si no hay sesiones activas, buscar la más reciente finalizada
    // para mostrar mensaje de finalización
    const finishedResult = await db
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
      .where(and(
        eq(chatGroups.slug, slug),
        lt(chatGroups.endDate, now) // Solo sesiones finalizada
      ))
      .orderBy(desc(chatGroups.endDate)) // Ordenar por la más recientemente finalizada
      .limit(1)

    return finishedResult[0] || null;
  } catch (error) {
    console.error("Error fetching chat group by slug:", error)
    throw new Error("Failed to fetch chat group by slug")
  }
}

// Verificar si un slug está disponible en un rango de fechas específico
export async function isSlugAvailable(slug: string, startDate: Date, endDate: Date, excludeId?: string) {
  try {
    // Buscar si existe algún grupo con el mismo slug que tenga solapamiento de fechas
    // Dos intervalos se solapan si: startA < endB AND startB < endA
    // En nuestro caso: startDate < chatGroups.endDate AND chatGroups.startDate < endDate
    
    const conditions = [
      eq(chatGroups.slug, slug),
      and(
        lt(chatGroups.startDate, endDate),
        gt(chatGroups.endDate, startDate)
      )
    ]

    // Si estamos editando un grupo existente, excluir su propio ID
    if (excludeId) {
      conditions.push(ne(chatGroups.id, excludeId))
    }

    const conflictingGroups = await db
      .select({
        id: chatGroups.id,
        slug: chatGroups.slug,
        startDate: chatGroups.startDate,
        endDate: chatGroups.endDate,
      })
      .from(chatGroups)
      .where(and(...conditions))
      .limit(1)

    // Si no hay grupos conflictivos, el slug está disponible
    return conflictingGroups.length === 0
  } catch (error) {
    console.error("Error checking slug availability:", error)
    throw new Error("Failed to check slug availability")
  }
}

export async function getGroupNames(){
    try {
        const result = await db
            .select({
                id: chatGroups.id,
                name: chatGroups.name,
                startDate: chatGroups.startDate,
            })
            .from(chatGroups)

        return result;
    }catch (error) {
        console.error("Error getting slugs:", error)
        throw new Error("Failed to get slugs")
    }
}

export async function getGroupConversationInfo(chatGroupId: string): Promise<{id: string, name: string, startDate: Date}> {
    try {
        // Obtener información básica del grupo
        const groupResult = await db
            .select({
                id: chatGroups.id,
                name: chatGroups.name,
                startDate: chatGroups.startDate,
            })
            .from(chatGroups)
            .where(eq(chatGroups.id, chatGroupId))
            .limit(1)

        if(groupResult.length === 0)
            throw new Error(
                "Chat group not found"
            )
        const group = groupResult[0]

        return {id: group.id, name: group.name, startDate: group.startDate};
    } catch (error) {
        console.error("Error fetching chat group info conversation by ID:", error)
        throw new Error("Failed to fetch chat group info conversation ")
    }
}

export async function getGroupConversationByChatId(id: string): Promise<{id: string, name: string, startDate: Date}> {
    try {
        // Obtener información básica del grupo
        const groupResult = await db
            .select({
                id: chatGroups.id,
                name: chatGroups.name,
                startDate: chatGroups.startDate,
            })
            .from(chatGroups)
            .innerJoin(chatSessions, eq(chatSessions.chatGroupId, chatGroups.id))
            .where(eq(chatSessions.id, id))
            .limit(1)

        if(groupResult.length === 0)
            throw new Error(
                "Chat group not found"
            )
        const group = groupResult[0]

        return {id: group.id, name: group.name, startDate: group.startDate};
    } catch (error) {
        console.error("Error fetching chat group info conversation by ID:", error)
        throw new Error("Failed to fetch chat group info conversation ")
    }
}

// Obtener estadísticas de sesiones de chat para un grupo específico
export async function getChatGroupSessionStats(chatGroupId: string) {
  try {
    // Obtener todas las sesiones del grupo
    const sessions = await db
      .select({
        id: chatSessions.id,
        sessionEndedAt: chatSessions.sessionEndedAt,
        createdAt: chatSessions.createdAt,
      })
      .from(chatSessions)
      .where(eq(chatSessions.chatGroupId, chatGroupId))

    // Calcular estadísticas
    const total = sessions.length
    const finished = sessions.filter(session => session.sessionEndedAt !== null).length
    const inProgress = total - finished

    return {
      total,
      inProgress,
      finished
    }
  } catch (error) {
    console.error("Error fetching chat group session stats:", error)
    throw new Error("Failed to fetch chat group session stats")
  }
}