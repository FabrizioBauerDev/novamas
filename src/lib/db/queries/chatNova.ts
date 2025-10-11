import { db } from "@/db";
import { messages, chatGroups, chatSessions, evaluationForms } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import type { UIMessage } from "ai";
import { safeDecryptMessage } from "@/lib/crypto";

// Función para cargar mensajes (equivalente a loadChat de la guía AI SDK)
export async function getChat(chatSessionId: string): Promise<UIMessage[]> {
  try {
    const dbMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatSessionId, chatSessionId))
      .orderBy(messages.createdAt);
    // Convertir mensajes de BD a formato UIMessage y desencriptar el contenido
    const uiMessages: UIMessage[] = dbMessages.map((msg) => ({
      id: msg.id,
      role: msg.sender,
      parts: [
        {
          type: "text" as const,
          text: safeDecryptMessage(msg.content), // Desencriptar el mensaje automáticamente
        },
      ],
      metadata: {
        createdAt: msg.createdAt.getTime(),
        messageTokensIn: msg.messageTokensIn || undefined,
        messageTokensOut: msg.messageTokensOut || undefined,
        messageTokensReasoning: msg.messageTokensReasoning || undefined,
      },
    }));

    return uiMessages;
  } catch (error) {
    console.error("Error loading chat messages:", error);
    return []; // Retornar array vacío si hay error
  }
}

export async function getChatSessionById(chatSessionId: string) {
  try {
    const dbSession = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, chatSessionId))
      .limit(1);
    if (dbSession.length === 0) {
      return {
        success: false,
        error: "No existe una sesión de chat válida para este ID.",
      };
    }
    return {
      success: true,
      data: dbSession[0],
    };
  } catch (error) {
    console.error("queries - chatNova - getChatSessionById - Error loading chat session:", error);
    return {
      success: false,
      error: "Error interno del servidor",
    };
  }
}

export async function checkChatGroupBySlug(slug: string) {
  try{
    const currentDate = new Date();
    const validChatGroups = await db
      .select()
      .from(chatGroups)
      .where(
        and(
          eq(chatGroups.slug, slug.toLowerCase()),
          lte(chatGroups.startDate, currentDate),
          gte(chatGroups.endDate, currentDate)
        )
      );
    if (validChatGroups.length === 0) {
      return {
        success: false,
        error: "El enlace ha expirado o no existe un grupo de chat válido para este enlace.",
        id: null
      };
    }
    else{
      return {
        success: true,
        error: "",
        id: validChatGroups[0].id
      };
    }
  }catch (error) {
    console.error("queries - chatNova - checkChatGroupBySlug - Error checking chat group:", error);
    return {
      success: false,
      error: "Error interno del servidor",
      id: null
    };
  }
}

export async function checkChatGroupById(chatGroupId: string) {
  try{
    const currentDate = new Date();
    const chatGroup = await db
                            .select()
                            .from(chatGroups)
                            .where(eq(chatGroups.id, chatGroupId))
                            .limit(1);
    if (chatGroup.length === 0) {
      return {
        success: false,
        error: "No existe un grupo de chat válido para este ID.",
      };
    }
    if (chatGroup[0].startDate > currentDate || chatGroup[0].endDate < currentDate) {
      return {
        success: false,
        error: "El grupo de chat no está activo en este momento.",
      };
    }
    return {
      success: true,
      error: "",
    };
  }catch(error){
    console.error("queries - chatNova - checkChatGroupById - Error checking chat group:", error);
    return {
      success: false,
      error: "Error interno del servidor",
    };
  }
}

export async function getEvaluationFormBySessionId(chatSessionId: string) {
  try {
    const dbEvaluationForm = await db
      .select()
      .from(evaluationForms)
      .where(eq(evaluationForms.id, chatSessionId))
      .limit(1);
    
    if (dbEvaluationForm.length === 0) {
      return {
        success: false,
        error: "No existe un formulario de evaluación para esta sesión.",
        data: null,
      };
    }
    
    return {
      success: true,
      error: "",
      data: dbEvaluationForm[0],
    };
  } catch (error) {
    console.error("queries - chatNova - getEvaluationFormBySessionId - Error loading evaluation form:", error);
    return {
      success: false,
      error: "Error interno del servidor",
      data: null,
    };
  }
}
