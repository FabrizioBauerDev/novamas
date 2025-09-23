"use server"

import { getAllChatGroups, getChatGroupById, getChatGroupBySlug, isSlugAvailable } from "@/lib/db/queries/chatGroup"
import { deleteChatGroupById, createChatGroup, updateChatGroupDescription } from "@/lib/db/mutations/chatGroup"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { createChatGroupSchema, updateDescriptionSchema } from "@/schema/zodSchemas"
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

    // Verificar que el slug esté disponible en esa fecha y hora
    const slugAvailable = await isSlugAvailable(slug, startDateTime, endDateTime);
    if (!slugAvailable) {
      return { 
        success: false, 
        error: `El slug "${slug}" ya está en uso durante el período seleccionado. Por favor, elija otro slug o modifique las fechas.` 
      };
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

// Server Action para verificar disponibilidad de slug
export async function checkSlugAvailabilityAction(slug: string, startDate: string, endDate: string, excludeId?: string) {
  try {
    // Convertir las fechas de string a Date
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    // Verificar validez de las fechas
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return { success: false, error: "Las fechas proporcionadas no son válidas" };
    }

    // Verificar que la fecha de inicio sea anterior a la fecha de fin
    if (startDateTime >= endDateTime) {
      return { success: false, error: "La fecha de inicio debe ser anterior a la fecha de fin" };
    }

    // Verificar disponibilidad del slug
    const isAvailable = await isSlugAvailable(slug, startDateTime, endDateTime, excludeId);
    
    return { 
      success: true, 
      available: isAvailable,
      message: isAvailable 
        ? "El slug está disponible para el período seleccionado" 
        : `El slug "${slug}" ya está en uso durante el período seleccionado`
    };
  } catch (error) {
    console.error("Error in checkSlugAvailabilityAction:", error);
    return { success: false, error: "Error al verificar la disponibilidad del slug" };
  }
}

// Server Action para obtener un ChatGroup por slug y verificar su estado
export async function getChatGroupBySlugAction(slug: string) {
  try {
    const group = await getChatGroupBySlug(slug);
    if (!group) {
      return { success: false, error: "Sesión grupal no encontrada" };
    }

    const now = new Date();
    const startDate = new Date(group.startDate);
    const endDate = new Date(group.endDate);
    
    // Verificar el estado de la sesión
    if (now > endDate) {
      return { 
        success: false, 
        error: "Esta sesión grupal ha finalizado",
        status: "FINALIZADA"
      };
    }
    
    if (now < startDate) {
      const timeDiff = startDate.getTime() - now.getTime();
      const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
      
      if (minutesDiff > 10) {
        return { 
          success: false, 
          error: `Esta sesión grupal comenzará en ${Math.ceil(minutesDiff / 60)} horas y ${minutesDiff % 60} minutos. Vuelve cuando falten 10 minutos o menos.`,
          status: "PENDIENTE_LEJANA"
        };
      } else {
        return { 
          success: true, 
          data: group,
          status: "PENDIENTE_PROXIMA",
          minutesRemaining: minutesDiff
        };
      }
    }
    
    // La sesión está activa
    return { 
      success: true, 
      data: group,
      status: "ACTIVA"
    };
  } catch (error) {
    console.error("Error in getChatGroupBySlugAction:", error);
    return { success: false, error: "Error al verificar la sesión grupal" };
  }
}

// Server Action para verificar contraseña de un ChatGroup
export async function verifyChatGroupPasswordAction(slug: string, password: string) {
  try {
    const group = await getChatGroupBySlug(slug);
    if (!group) {
      return { success: false, error: "Sesión grupal no encontrada" };
    }

    // Verificar que la sesión no haya finalizado antes de validar la contraseña
    const now = new Date();
    const endDate = new Date(group.endDate);
    
    if (now > endDate) {
      return { success: false, error: "Esta sesión grupal ha finalizado" };
    }

    // Desencriptar la contraseña almacenada
    const decryptedPassword = decryptMessage(group.password);
    
    // Verificar si la contraseña coincide
    if (password === decryptedPassword) {
      return { success: true, message: "Contraseña correcta" };
    } else {
      return { success: false, error: "Contraseña incorrecta" };
    }
  } catch (error) {
    console.error("Error in verifyChatGroupPasswordAction:", error);
    return { success: false, error: "Error al verificar la contraseña" };
  }
}

// Server Action para actualizar la descripción de un ChatGroup
export async function updateChatGroupDescriptionAction(id: string, description: string) {
  try {
    // Validar los datos con Zod
    const validatedFields = updateDescriptionSchema.safeParse({ id, description });
    if (!validatedFields.success) {
      const errors = validatedFields.error.errors.map(err => err.message);
      return { success: false, error: errors.join(". ") };
    }

    // Obtener la sesión del usuario
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuario no autenticado" };
    }

    // Verificar permisos (solo ADMINISTRADOR e INVESTIGADOR)
    const userRole = session.user.role;
    if (userRole !== "ADMINISTRADOR" && userRole !== "INVESTIGADOR") {
      return { success: false, error: "No tienes permisos para editar la descripción" };
    }

    // Verificar que el grupo existe
    const group = await getChatGroupById(id);
    if (!group) {
      return { success: false, error: "Grupo no encontrado" };
    }

    // Actualizar la descripción
    await updateChatGroupDescription(id, description);

    // Revalidar las páginas para actualizar los datos
    revalidatePath(`/chatgroup/${id}`);
    revalidatePath("/chatgroup");

    return { success: true, message: "Descripción actualizada correctamente" };
  } catch (error) {
    console.error("Error in updateChatGroupDescriptionAction:", error);
    return { success: false, error: "Error al actualizar la descripción" };
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
