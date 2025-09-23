"use server"

import { auth } from "@/auth"
import { searchUsersNotInGroup, getChatGroupMembers } from "@/lib/db/queries/user"
import { addChatGroupMember, removeChatGroupMember } from "@/lib/db/mutations/chatGroupMember"
import { getChatGroupById } from "@/lib/db/queries/chatGroup"
import { addParticipantSchema, removeParticipantSchema, searchUsersSchema } from "@/schema/zodSchemas"
import { revalidatePath } from "next/cache"

// Verificar si el usuario tiene permisos para gestionar participantes
async function checkPermissions() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Usuario no autenticado" };
  }

  const userRole = session.user.role;
  if (userRole !== "ADMINISTRADOR" && userRole !== "INVESTIGADOR") {
    return { success: false, error: "No tienes permisos para realizar esta acción" };
  }

  return { success: true, userId: session.user.id, userRole };
}

// Buscar usuarios para añadir al grupo
export async function searchUsersForGroupAction(chatGroupId: string, searchTerm: string) {
  try {
    // Validar datos de entrada
    const validatedFields = searchUsersSchema.safeParse({ chatGroupId, searchTerm });
    if (!validatedFields.success) {
      const errors = validatedFields.error.errors.map(err => err.message);
      return { success: false, error: errors.join(". ") };
    }

    // Verificar permisos
    const permission = await checkPermissions();
    if (!permission.success) {
      return { success: false, error: permission.error };
    }

    // Verificar que el grupo existe
    const group = await getChatGroupById(chatGroupId);
    if (!group) {
      return { success: false, error: "Grupo no encontrado" };
    }

    // Buscar usuarios
    const users = await searchUsersNotInGroup(chatGroupId, searchTerm, 10);
    
    return { success: true, data: users };
  } catch (error) {
    console.error("Error in searchUsersForGroupAction:", error);
    return { success: false, error: "Error al buscar usuarios" };
  }
}

// Añadir un participante al grupo
export async function addParticipantToGroupAction(chatGroupId: string, userId: string) {
  try {
    // Validar datos de entrada
    const validatedFields = addParticipantSchema.safeParse({ chatGroupId, userId });
    if (!validatedFields.success) {
      const errors = validatedFields.error.errors.map(err => err.message);
      return { success: false, error: errors.join(". ") };
    }

    // Verificar permisos
    const permission = await checkPermissions();
    if (!permission.success) {
      return { success: false, error: permission.error };
    }

    // Verificar que el grupo existe
    const group = await getChatGroupById(chatGroupId);
    if (!group) {
      return { success: false, error: "Grupo no encontrado" };
    }

    // Añadir el participante
    await addChatGroupMember({ userId, chatGroupId });

    // Revalidar la página para actualizar los datos
    revalidatePath(`/chatgroup/${chatGroupId}`);
    revalidatePath("/chatgroup");

    return { success: true, message: "Participante añadido correctamente" };
  } catch (error) {
    console.error("Error in addParticipantToGroupAction:", error);
    
    // Manejar error de duplicado
    if (error instanceof Error && error.message.includes("duplicate")) {
      return { success: false, error: "El usuario ya es participante de este grupo" };
    }
    
    return { success: false, error: "Error al añadir el participante" };
  }
}

// Eliminar un participante del grupo
export async function removeParticipantFromGroupAction(chatGroupId: string, userId: string) {
  try {
    // Validar datos de entrada
    const validatedFields = removeParticipantSchema.safeParse({ chatGroupId, userId });
    if (!validatedFields.success) {
      const errors = validatedFields.error.errors.map(err => err.message);
      return { success: false, error: errors.join(". ") };
    }

    // Verificar permisos
    const permission = await checkPermissions();
    if (!permission.success) {
      return { success: false, error: permission.error };
    }

    // Verificar que el grupo existe
    const group = await getChatGroupById(chatGroupId);
    if (!group) {
      return { success: false, error: "Grupo no encontrado" };
    }

    // Solo el creador puede eliminarse a sí mismo, otros usuarios no pueden eliminar al creador
    if (userId === group.creatorId && permission.userId !== group.creatorId) {
      return { success: false, error: "Solo el creador puede eliminarse a sí mismo del grupo" };
    }

    // Eliminar el participante
    await removeChatGroupMember(userId, chatGroupId);

    // Revalidar la página para actualizar los datos
    revalidatePath(`/chatgroup/${chatGroupId}`);
    revalidatePath("/chatgroup");

    return { success: true, message: "Participante eliminado correctamente" };
  } catch (error) {
    console.error("Error in removeParticipantFromGroupAction:", error);
    return { success: false, error: "Error al eliminar el participante" };
  }
}

// Obtener los participantes de un grupo
export async function getChatGroupMembersAction(chatGroupId: string) {
  try {
    // Verificar permisos
    const permission = await checkPermissions();
    if (!permission.success) {
      return { success: false, error: permission.error };
    }

    // Obtener los participantes
    const members = await getChatGroupMembers(chatGroupId);
    
    return { success: true, data: members };
  } catch (error) {
    console.error("Error in getChatGroupMembersAction:", error);
    return { success: false, error: "Error al obtener los participantes" };
  }
}