"use server"

import { getAllChatGroups, getChatGroupById } from "@/lib/db/queries/chatGroup"
import { deleteChatGroupById, createChatGroup } from "@/lib/db/mutations/chatGroup"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { createChatGroupSchema } from "@/schema/zodSchemas"
import type { CreateGroupFormData } from "@/types/types"
import { decryptMessage } from "@/lib/crypto/encryption"

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

// Server Action para crear un ChatGroup
export async function createChatGroupAction(formData: CreateGroupFormData) {
  try {
    // Obtener la sesión del usuario
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuario no autenticado" };
    }

    // Validar los datos con Zod
    const validatedFields = createChatGroupSchema.safeParse(formData);
    if (!validatedFields.success) {
      const errors = validatedFields.error.errors.map(err => err.message);
      return { success: false, error: errors.join(". ") };
    }

    const { name, slug, description, password, startDate, startTime, endDate, endTime } = validatedFields.data;

    // Crear las fechas desde las strings ISO o desde date/time separados
    let startDateTime: Date;
    let endDateTime: Date;
    
    // Si startDate contiene una fecha ISO completa, úsala directamente
    if (startDate.includes('T') || startDate.includes('Z')) {
      startDateTime = new Date(startDate);
      endDateTime = new Date(endDate);
    } else {
      // Fallback para el formato anterior
      startDateTime = new Date(`${startDate}T${startTime}`);
      endDateTime = new Date(`${endDate}T${endTime}`);
    }

    // Crear el ChatGroup
    const newChatGroup = await createChatGroup({
      creatorId: session.user.id,
      name,
      slug,
      description,
      password,
      startDate: startDateTime,
      endDate: endDateTime,
    });

    // Revalidar la página para actualizar los datos
    revalidatePath("/chatgroup");

    return { success: true, data: newChatGroup };
  } catch (error) {
    console.error("Error in createChatGroupAction:", error);
    return { success: false, error: "Error al crear la sesión grupal" };
  }
}

// Server Action para desencriptar la contraseña de un ChatGroup
export async function decryptChatGroupPasswordAction(groupId: string) {
  try {
    // Obtener la sesión del usuario
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuario no autenticado" };
    }

    // Obtener el grupo
    const group = await getChatGroupById(groupId);
    if (!group) {
      return { success: false, error: "Grupo no encontrado" };
    }

    // Desencriptar la contraseña
    const decryptedPassword = decryptMessage(group.password);

    return { success: true, password: decryptedPassword };
  } catch (error) {
    console.error("Error in decryptChatGroupPasswordAction:", error);
    return { success: false, error: "Error al desencriptar la contraseña" };
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
