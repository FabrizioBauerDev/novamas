import { db } from "@/db";
import { chatSessions, evaluationForms, messages } from "@/db/schema";
import { EvaluationFormData, MyUIMessage } from "@/types/types";
import { checkChatGroupBySlug } from "../queries/chatNova";

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
    
    // Si existe slug, buscar ChatGroup válido
    if (slug) {
      const checkSlug = await checkChatGroupBySlug(slug);
      if (checkSlug.success) {
        chatGroupId = checkSlug.id;
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
      // Crear chatSession
      const [newChatSession] = await tx
        .insert(chatSessions)
        .values({
          chatGroupId: chatGroupId,
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
          content: textContent,
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