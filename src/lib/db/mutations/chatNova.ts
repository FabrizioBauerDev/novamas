import { db } from "@/db";
import { chatSessions, evaluationForms, messages, chatFeedbacks } from "@/db/schema";
import { EvaluationFormData, MyUIMessage } from "@/types/types";
import { checkChatGroupBySlug } from "../queries/chatNova";
import { safeEncryptMessage } from "@/lib/crypto";
import { eq } from "drizzle-orm";
import { CHAT_CONFIG } from "@/lib/chat-config";

export interface CreateFormChatSessionParams {
  formData: EvaluationFormData;
  slug?: string;
}

export interface CreateFormChatSessionResult {
  success: boolean;
  chatSessionId?: string;
  error?: string;
}

// Función para calcular el score del formulario
function calcScore(formData: EvaluationFormData): number {
  let score = 0;
  
  // Ajustado a los nuevos valores de enum
  if (formData.couldntStop === "SI") {
    score += 2;
  }
  if (formData.couldntStop === "NO_ES_SEG") {
    score += 1;
  }
  if (formData.personalIssues === "SI") {
    score += 2;
  }
  if (formData.triedToQuit === "true") {  // boolean como string
    score += 2;
  }
  
  return score;
}

export async function createFormChatSession({
  formData,
  slug
}: CreateFormChatSessionParams): Promise<CreateFormChatSessionResult> {
  try {
    let chatGroupId: string | null = null;
    let groupEndDate: Date | null = null;
    
    // Si existe slug, buscar ChatGroup válido
    if (slug) {
      const checkSlug = await checkChatGroupBySlug(slug);
      if (checkSlug.success) {
        chatGroupId = checkSlug.id;
        
        // Obtener el endDate del grupo para validar tiempo mínimo
        const { getChatGroupById } = await import("../queries/chatGroup");
        const chatGroup = await getChatGroupById(chatGroupId!);
        
        if (!chatGroup) {
          return {
            success: false,
            error: "No se pudo obtener información del grupo de chat."
          };
        }
        
        groupEndDate = chatGroup.endDate;
        
        // Validar que queden al menos 3 minutos hasta el endDate
        const timeUntilEnd = groupEndDate.getTime() - Date.now();
        
        if (timeUntilEnd < CHAT_CONFIG.MIN_TIME_REQUIRED_MS) {
          const minutesRemaining = Math.ceil(timeUntilEnd / 60000);
          return {
            success: false,
            error: `No se puede iniciar una sesión de chat. El grupo finaliza en ${minutesRemaining} minuto(s) y se requiere un mínimo de 3 minutos.`
          };
        }
      }else{
        return {
          success: false,
          error: checkSlug.error 
        };
      }
    }

    // Calcular el score
    const calculatedScore = calcScore(formData);
    
    // Iniciar transacción para crear la sesión de chat
    const result = await db.transaction(async (tx) => {
      // Crear chatSession con maxDurationMs desde la configuración
      const [newChatSession] = await tx
        .insert(chatSessions)
        .values({
          chatGroupId: chatGroupId,
          maxDurationMs: CHAT_CONFIG.MAX_DURATION_MS, // Usar valor de configuración
          // Los demás campos se setearán con sus valores por defecto
        })
        .returning({ id: chatSessions.id });
      
      // Crear formulario de evaluación con el mismo ID (relación 1:1)
      await tx
        .insert(evaluationForms)
        .values({
          id: newChatSession.id, // PK compartida
          gender: formData.gender as "MASCULINO" | "FEMENINO" | "OTRO",
          age: parseInt(formData.age),
          onlineGaming: formData.onlineGaming === "true",
          couldntStop: formData.couldntStop as "NO" | "NO_ES_SEG" | "SI",
          personalIssues: formData.personalIssues as "NO" | "NO_AP" | "SI",
          triedToQuit: formData.triedToQuit === "true",
          score: calculatedScore,
        });
      
      return newChatSession.id;
    });
    
    return {
      success: true,
      chatSessionId: result
    };
    
  } catch (error) {
    console.error("Error creando la sesión de chat:", error);
    return {
      success: false,
      error: "Error interno del servidor"
    };
  }
}

// Función para guardar mensajes (equivalente a saveChat de la guía AI SDK)
export interface SaveChatParams {
  chatSessionId: string;
  messages: MyUIMessage[];
}

export async function saveChat({
  chatSessionId,
  messages: uiMessages,
}: SaveChatParams): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      // Insertar todos los mensajes que no existen en la base de datos
      for (const uiMessage of uiMessages) {
        // Extraer el texto del primer part (asumiendo que es de tipo text)
        const textContent = uiMessage.parts
          .filter(part => part.type === 'text')
          .map(part => part.text)
          .join('');
        
        // Filtrar solo roles válidos (assistant, user)
        const validRole = uiMessage.role === 'system' ? 'assistant' : uiMessage.role;
        
        await tx.insert(messages).values({
          chatSessionId: chatSessionId,
          sender: validRole,
          content: safeEncryptMessage(textContent), // Encriptar el contenido antes de guardar
          messageTokensIn: uiMessage.metadata?.messageTokensIn || null,
          messageTokensOut: uiMessage.metadata?.messageTokensOut || null,
          messageTokensReasoning: uiMessage.metadata?.messageTokensReasoning || null,
          createdAt: uiMessage.metadata?.createdAt 
            ? new Date(uiMessage.metadata.createdAt) 
            : new Date(),
        });
      }
    });
  } catch (error) {
    console.error(`Error al guardar mensajes de chat ${chatSessionId}. Error:`, error);
    throw error;
  }
}

// ===============================
// FUNCIONES PARA CHAT FEEDBACK
// ===============================

export interface CreateChatFeedbackParams {
  chatSessionId: string;
  rating: number;
  comment?: string;
}

export interface CreateChatFeedbackResult {
  success: boolean;
  feedbackId?: string;
  error?: string;
}

export async function createChatFeedback({
  chatSessionId,
  rating,
  comment
}: CreateChatFeedbackParams): Promise<CreateChatFeedbackResult> {
  try {
    // Validaciones del lado del servidor
    if (!chatSessionId) {
      return {
        success: false,
        error: "ID de sesión de chat requerido"
      };
    }

    // Validar que el rating esté en el rango correcto (1-5)
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return {
        success: false,
        error: "La valoración debe ser un número entre 1 y 5"
      };
    }

    // Validar longitud del comentario si existe
    if (comment && comment.length > 200) {
      return {
        success: false,
        error: "El comentario no puede exceder los 200 caracteres"
      };
    }

    // Verificar que la sesión de chat existe
    const existingSession = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, chatSessionId))
      .limit(1);

    if (existingSession.length === 0) {
      return {
        success: false,
        error: "La sesión de chat no existe"
      };
    }

    // Verificar si ya existe un feedback para esta sesión
    if (existingSession[0].chatFeedBackId) {
      return {
        success: false,
        error: "Ya existe un feedback para esta sesión de chat"
      };
    }

    // Crear el feedback y actualizar la sesión en una transacción
    const result = await db.transaction(async (tx) => {
      // Crear el feedback
      const [newFeedback] = await tx
        .insert(chatFeedbacks)
        .values({
          rating,
          comment: comment || null,
        })
        .returning({ id: chatFeedbacks.id });

      // Actualizar la sesión de chat con el ID del feedback
      await tx
        .update(chatSessions)
        .set({ 
          chatFeedBackId: newFeedback.id,
          updatedAt: new Date()
        })
        .where(eq(chatSessions.id, chatSessionId));

      return newFeedback.id;
    });

    return {
      success: true,
      feedbackId: result
    };

  } catch (error) {
    console.error("Error creando la valoración de chat:", error);
    return {
      success: false,
      error: "Error interno del servidor al guardar la valoración"
    };
  }
}

// ===============================
// FUNCIONES PARA CONTROL DE TIEMPO DE SESIÓN
// ===============================

/**
 * Marca que una sesión de chat ha utilizado su mensaje de gracia
 * @param chatSessionId - ID de la sesión de chat
 * @returns Promise<void>
 */
export async function markGraceMessageUsed(chatSessionId: string): Promise<void> {
  try {
    await db
      .update(chatSessions)
      .set({ 
        usedGraceMessage: true,
        updatedAt: new Date()
      })
      .where(eq(chatSessions.id, chatSessionId));
    
    console.log(`Mensaje de gracia marcado para la sesión ${chatSessionId}`);
  } catch (error) {
    console.error(`Error marcando mensaje de gracia para sesión ${chatSessionId}:`, error);
    throw error;
  }
}

/**
 * Finaliza una sesión de chat marcando la fecha de finalización
 * @param chatSessionId - ID de la sesión de chat
 * @returns Promise con resultado de la operación
 */
export async function finalizeChatSession(chatSessionId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Verificar que la sesión existe
    const existingSession = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, chatSessionId))
      .limit(1);

    if (existingSession.length === 0) {
      return {
        success: false,
        error: "La sesión de chat no existe"
      };
    }

    // Ya está finalizada?
    if (existingSession[0].sessionEndedAt) {
      return {
        success: false,
        error: "La sesión de chat ya fue finalizada"
      };
    }

    // Marcar como finalizada
    await db
      .update(chatSessions)
      .set({ 
        sessionEndedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(chatSessions.id, chatSessionId));

    console.log(`Sesión ${chatSessionId} finalizada exitosamente`);
    
    return {
      success: true
    };
  } catch (error) {
    console.error(`Error finalizando sesión ${chatSessionId}:`, error);
    return {
      success: false,
      error: "Error interno del servidor al finalizar la sesión"
    };
  }
}