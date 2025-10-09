"use server";

import {
  createFormChatSession,
  CreateFormChatSessionParams,
  createChatFeedback,
  CreateChatFeedbackParams,
  CreateChatFeedbackResult,
} from "@/lib/db/mutations/chatNova";
import { headers } from "next/headers";

export async function createFormChatSessionAction(
  params: CreateFormChatSessionParams
) {
  try {
    // Validar que los campos requeridos estén presentes
    const { formData } = params;
    
    if (!formData.gender || !formData.age || !formData.onlineGaming) {
      return {
        success: false,
        error: "Campos requeridos faltantes"
      };
    }
    
    // Validar rango de edad
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 13 || age > 99) {
      return {
        success: false,
        error: "La edad debe estar entre 13 y 99 años"
      };
    }
    
    // Si onlineGaming es false, los otros campos pueden estar vacíos
    if (formData.onlineGaming === "true") {
      if (!formData.couldntStop || !formData.personalIssues || !formData.triedToQuit) {
        return {
          success: false,
          error: "Todos los campos del paso 2 son requeridos"
        };
      }
    } else {
      // Si no juega online, setear valores por defecto para el cálculo
      formData.couldntStop = "NO";
      formData.personalIssues = "NO";
      formData.triedToQuit = "false";
    }
    
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip");
    
    console.log("IP del cliente:", ip);
    
    if (params.formData.location) {
      console.log("Ubicación obtenida: ", params.formData.location);
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${params.formData.location.latitude}&lon=${params.formData.location.longitude}&zoom=14&format=json`
        );
        const data = await response.json();
        console.log("Ubicación geográfica:", data);
      } catch (geoError) {
        console.warn("Error obteniendo ubicación geográfica:", geoError);
      }
    }
    
    return await createFormChatSession(params);
    
  } catch (error) {
    console.error("Error en createFormChatSessionAction:", error);
    return {
      success: false,
      error: "Error interno del servidor"
    };
  }
}

export async function createChatFeedbackAction(
  params: CreateChatFeedbackParams
): Promise<CreateChatFeedbackResult> {
  try {
    // Validaciones del lado del servidor (duplicadas por seguridad)
    const { chatSessionId, rating, comment } = params;
    
    // Validar chatSessionId
    if (!chatSessionId || typeof chatSessionId !== "string") {
      return {
        success: false,
        error: "ID de sesión de chat inválido"
      };
    }
    
    // Validar rating
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return {
        success: false,
        error: "La valoración debe ser un número entre 1 y 5"
      };
    }
    
    // Validar comentario opcional
    if (comment !== undefined && comment !== null) {
      if (typeof comment !== "string") {
        return {
          success: false,
          error: "El comentario debe ser una cadena de texto"
        };
      }
      
      if (comment.length > 200) {
        return {
          success: false,
          error: "El comentario no puede exceder los 200 caracteres"
        };
      }
    }
    
    // Llamar a la función de mutación
    return await createChatFeedback(params);
    
  } catch (error) {
    console.error("Error en createChatFeedbackAction:", error);
    return {
      success: false,
      error: "Error interno del servidor al procesar la valoración"
    };
  }
}

/**
 * Server Action para obtener información de sesión
 * Usado por el componente de chat para inicializar el timer
 */
export async function getSessionDataAction(chatSessionId: string) {
  try {
    const { getChatSessionById } = await import("@/lib/db");
    
    if (!chatSessionId) {
      return {
        success: false,
        error: "ID de sesión requerido"
      };
    }

    const chatSession = await getChatSessionById(chatSessionId);

    if (!chatSession.success || !chatSession.data) {
      return {
        success: false,
        error: "Sesión de chat no encontrada"
      };
    }

    // Si es sesión grupal, obtener el endDate del grupo
    let groupEndDate: string | null = null;
    
    if (chatSession.data.chatGroupId) {
      const { getChatGroupById } = await import("@/lib/db/queries/chatGroup");
      const groupData = await getChatGroupById(chatSession.data.chatGroupId);
      
      if (groupData) {
        groupEndDate = groupData.endDate.toISOString();
      }
    }

    return {
      success: true,
      data: {
        id: chatSession.data.id,
        createdAt: chatSession.data.createdAt.toISOString(),
        chatGroupId: chatSession.data.chatGroupId,
        maxDurationMs: chatSession.data.maxDurationMs || 1200000,
        usedGraceMessage: chatSession.data.usedGraceMessage || false,
        groupEndDate: groupEndDate,
      }
    };
  } catch (error) {
    console.error("Error en getSessionDataAction:", error);
    return {
      success: false,
      error: "Error interno del servidor"
    };
  }
}

/**
 * Server Action para obtener los mensajes de una sesión
 * Útil para recargar mensajes después de eventos como mensaje de gracia
 */
export async function getChatMessagesAction(chatSessionId: string) {
  try {
    const { getChat } = await import("@/lib/db");
    
    if (!chatSessionId) {
      return {
        success: false,
        error: "ID de sesión requerido",
        data: []
      };
    }

    const messages = await getChat(chatSessionId);

    return {
      success: true,
      data: messages
    };
  } catch (error) {
    console.error("Error en getChatMessagesAction:", error);
    return {
      success: false,
      error: "Error interno del servidor",
      data: []
    };
  }
}

/**
 * Server Action para finalizar una sesión de chat
 */
export async function finalizeChatSessionAction(chatSessionId: string) {
  try {
    const { finalizeChatSession } = await import("@/lib/db");
    
    if (!chatSessionId) {
      return {
        success: false,
        error: "ID de sesión requerido"
      };
    }

    const result = await finalizeChatSession(chatSessionId);
    return result;
    
  } catch (error) {
    console.error("Error en finalizeChatSessionAction:", error);
    return {
      success: false,
      error: "Error interno del servidor al finalizar la sesión"
    };
  }
}
