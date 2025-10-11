import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { env } from "process";
import { MyUIMessage } from "@/types/types";
import {
  checkChatGroupById,
  getChat,
  getChatSessionById,
  saveChat,
  markGraceMessageUsed,
  getEvaluationFormBySessionId,
} from "@/lib/db";
import { createWelcomeMessage } from "@/lib/chat-utils";
import { getRelevantInformation } from "@/lib/pgvector/utils";
import { z } from "zod";
import { CHAT_CONFIG, isSessionExpired } from "@/lib/chat-config";
import { all } from "axios";

// Permite respuestas de streaming hasta 30 segundos
export const maxDuration = 30;

// Definir la tool para búsqueda RAG
const ragSearchTool = tool({
  description: `Busca información relevante en la base de conocimiento especializada dependiendo la categoria especifica de informacion que necesites. 
    Usa esta herramienta cuando necesites información específica sobre temas académicos, 
    documentos o cualquier contenido que pueda estar almacenado en la base de datos de conocimiento.`,
  inputSchema: z.object({
    query: z.string().describe('Consulta del usuario'),
    category: z.enum(["ESTADISTICAS", "NUMERO_TELEFONO", "TECNICAS_CONTROL", "OTRO"]),
    location: z.string().describe('Ubicación del usuario')
  }),
  execute: async ({ query, category, location } ) => {
    try {
      // Validar que el query no esté vacío
      if (!query || query.trim() === "") {
        return "La consulta está vacía. Por favor, proporciona una pregunta específica para buscar en la base de conocimiento.";
      }

      if(category=="NUMERO_TELEFONO"){
        query = query+" "+location;
      }

      console.log(query)
      console.log(category)
      console.log(location)


      const ragResponse = await getRelevantInformation(query, category);


      // Verificar si la respuesta está vacía o es null/undefined
      if (!ragResponse || ragResponse.trim() === "") {
        return "No se encontró información relevante en la base de conocimiento para tu consulta. Puedo ayudarte con información general si lo deseas.";
      }
      
      // Limpiar la respuesta pero mantener más información
      const cleanedRagResponse = ragResponse.replace(/[\n\r]+/g, ' ').trim();
      
      // Verificar después de limpiar
      if (!cleanedRagResponse || cleanedRagResponse === "") {
        return "La información encontrada en la base de conocimiento no pudo ser procesada correctamente.";
      }
      
      // Aumentar el límite de palabras para conservar más contexto
      const limitedRag = cleanedRagResponse.split(" ").slice(0, 300).join(" ");
      console.log(limitedRag)
      return `Información encontrada en la base de conocimiento: ${limitedRag}
      Fuente: Base de conocimiento especializada`;
    } catch (error) {
      console.error("Error al acceder a la base de conocimiento:", error);
      return `Error al acceder a la base de conocimiento: ${error instanceof Error ? error.message : "Error desconocido"}. Puedo ayudarte con información general si lo deseas.`;
    }
  },
});

export async function POST(req: Request) {

  try {
    const logString = "APP | API | CHAT | ROUTE - ";
    const system = env.SYSTEM_PROMPT;

    if (!system) {
      console.error(logString + "SYSTEM_PROMPT no está definido");
      return NextResponse.json(
        { error: "Error de configuración del sistema" },
        { status: 500 }
      );
    }

    // Siguiendo la guía AI SDK: recibir solo el último mensaje cuando se optimiza
    const { message, id }: { message: MyUIMessage; id: string } =
        await req.json();

    // Validar que el mensaje tenga contenido
    if (!message || !message.parts || message.parts.length === 0) {
      console.error(logString + "Mensaje vacío o sin partes");
      return NextResponse.json(
          { error: "El mensaje no puede estar vacío." },
          { status: 400 }
      );
    }

    // Validar que cada parte de texto no exceda 280 caracteres
    for (const part of message.parts) {
      if (part.type === "text") {
        const trimmedText = part.text.trim();
        
        if (!trimmedText) {
          console.error(logString + "Texto del mensaje vacío");
          return NextResponse.json(
              { error: "El mensaje no puede estar vacío." },
              { status: 400 }
          );
        }
        
        if (trimmedText.length > 280) {
          console.error(
              logString + `Mensaje demasiado largo: ${trimmedText.length} caracteres`
          );
          return NextResponse.json(
              { 
                error: "El mensaje no puede exceder los 280 caracteres.",
                length: trimmedText.length,
                maxLength: 280
              },
              { status: 400 }
          );
        }
      }
    }

    // Obtener la sesion de chat para comprobar si tiene asociado un grupo de chat
    const chatSession = await getChatSessionById(id);
    if (!chatSession.success) {
      console.error(
          "Error en API chatNova - Sesión de chat no válida:",
          chatSession.error
      );
      return NextResponse.json(
          { error: "Sesión de chat no válida." },
          { status: 400 }
      );
    }

    // ========================================================================
    // VALIDACIÓN DE TIEMPO - APLICA TANTO PARA SESIONES INDIVIDUALES COMO GRUPALES
    // ========================================================================
    let shouldAddGraceMessage = false;
    let maxDuration: number;
    let sessionExpired: boolean;
    
    if (chatSession.data?.chatGroupId) {
      // SESIÓN GRUPAL: Calcular tiempo basado en endDate del grupo
      // Obtener el endDate del grupo directamente (sin validar si está activo)
      // para permitir el mensaje de gracia
      const { getChatGroupById } = await import("@/lib/db/queries/chatGroup");
      const groupData = await getChatGroupById(chatSession.data.chatGroupId);
      
      if (!groupData) {
        return NextResponse.json(
          { error: "No se pudo obtener información del grupo" },
          { status: 400 }
        );
      }
      
      // Validar que el grupo exista y que no se esté intentando usar
      // ANTES de la fecha de inicio (startDate)
      const now = Date.now();
      if (groupData.startDate.getTime() > now) {
        console.error(
          logString + "Intento de usar grupo antes de su inicio:",
          groupData.startDate
        );
        return NextResponse.json(
          { error: "El grupo de chat aún no ha iniciado." },
          { status: 400 }
        );
      }
      
      // Calcular si ya pasó el endDate
      const timeUntilEnd = groupData.endDate.getTime() - now;
      sessionExpired = timeUntilEnd <= 0;
      
    } else {
      // SESIÓN INDIVIDUAL: Usar maxDurationMs como antes
      maxDuration = chatSession.data?.maxDurationMs || CHAT_CONFIG.MAX_DURATION_MS;
      sessionExpired = isSessionExpired(chatSession.data!.createdAt, maxDuration);
    }

    // Lógica común para ambos tipos de sesión
    if (sessionExpired) {
      // La sesión ya superó el tiempo
      
      if (chatSession.data?.usedGraceMessage) {
        // Ya usó su mensaje de gracia, bloquear completamente
        console.log(
          logString + 
          `Sesión ${id} intentó enviar mensaje después de usar mensaje de gracia`
        );
        
        return NextResponse.json(
          {
            error: "TIEMPO_EXPIRADO",
            message: "Tu sesión ha finalizado. Por favor completa el formulario final.",
            sessionExpired: true,
          },
          { status: 403 }
        );
      } else {
        // Permitir este último mensaje y marcar el flag
        console.log(
          logString + 
          `Sesión ${id} alcanzó el límite de tiempo. Permitiendo mensaje de gracia.`
        );
        
        shouldAddGraceMessage = true;
        
        try {
          await markGraceMessageUsed(id);
        } catch (error) {
          console.error(
            logString + `Error marcando mensaje de gracia para sesión ${id}:`,
            error
          );
          // Continuar de todas formas para no bloquear al usuario
        }
      }
    }

    // Cargar mensajes previos de la BD (equivalente a loadChat de la guía)
    const previousMessages = await getChat(id);

    let allMessages: MyUIMessage[];
    let welcomeMessage: MyUIMessage | undefined;
    if (previousMessages.length === 0) {
      welcomeMessage = createWelcomeMessage() as MyUIMessage;
      allMessages = [welcomeMessage, message];
    } else {
      allMessages = [...(previousMessages as MyUIMessage[]), message];
    }
    message.metadata = message.metadata ?? {};
    message.metadata.createdAt = Date.now();

    // Obtener el formulario de evaluación asociado a la sesión
    const evaluationFormResponse = await getEvaluationFormBySessionId(id);
    
    if (!evaluationFormResponse.success || !evaluationFormResponse.data) {
      console.error(
        logString + "Error obteniendo formulario de evaluación:",
        evaluationFormResponse.error
      );
      return NextResponse.json(
        { error: "No se pudo obtener el formulario de evaluación de esta sesión." },
        { status: 400 }
      );
    }

    const evaluationForm = evaluationFormResponse.data;
    
    // Formatear la fecha y hora
    const messageDate = new Date(message.metadata.createdAt);
    const formattedDateTime = messageDate.toLocaleString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const enhancedSystemPrompt = system
        .replace(/<ubi>/g, evaluationForm.address || "Ubicación no disponible")
        .replace(/<riesgo>/g, String(evaluationForm.score))
        .replace(/<edad>/g, String(evaluationForm.age))
        .replace(/<diayhora>/g, formattedDateTime);

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: convertToModelMessages(allMessages),
      system: enhancedSystemPrompt,
      temperature: 0.5,
      maxOutputTokens: 500,
      // Temperatura, top_p y no se si top_k se pueden pasar aquí
      tools: {
        searchKnowledgeBase: ragSearchTool,
      },
      stopWhen: stepCountIs(3),
      maxRetries: 2,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 8192, // Número de tokens de pensamiento permitidos
            includeThoughts: false, // No incluir resumen del proceso de pensamiento
          },
        },
      },
      onError: (error) => {
        console.error('❌ Error while streaming:', JSON.stringify(error, null, 2))
      },
    });

    return result.toUIMessageStreamResponse({
      originalMessages: allMessages,
      messageMetadata: ({ part }) => {
        if (part.type === "start") {
          return {
            createdAt: Date.now(),
          };
        }
        if (part.type === "finish") {
          return {
            // Para mensajes del asistente, incluir todos los tipos de tokens
            messageTokensIn: part.totalUsage.inputTokens,
            messageTokensOut: part.totalUsage.outputTokens,
            messageTokensReasoning: part.totalUsage.reasoningTokens || 0,
          };
        }
      },
      onFinish: async ({ messages }) => {
        try {
          // Verificar si acabamos de usar el mensaje de gracia
          const updatedSession = await getChatSessionById(id);
          let messagesToSave = messages;

          // Añadir mensaje de gracia para TODAS las sesiones (individuales y grupales)
          if (updatedSession.data?.usedGraceMessage) {
            // Verificar si ya existe el mensaje de gracia en los mensajes
            const hasGraceMessage = messages.some(msg => 
              msg.role === "assistant" && 
              msg.parts.some(part => 
                part.type === "text" && 
                part.text.includes("Has utilizado tu mensaje de gracia")
              )
            );

            // Solo añadir si no existe ya
            if (!hasGraceMessage) {
              const graceMessage: MyUIMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                parts: [{
                  type: "text",
                  text: CHAT_CONFIG.getGraceUsedMessage()
                }],
                metadata: { createdAt: Date.now() }
              };

              messagesToSave = [...messages, graceMessage];
              console.log(logString + `Mensaje de gracia utilizada añadido para sesión ${id}`);
            }
          }

          // Guardar mensajes
          if (welcomeMessage) {
            await saveChat({
              chatSessionId: id,
              messages: messagesToSave,
            });
          } else {
            // Si hay mensaje de gracia, guardar los últimos 3 (user + assistant + grace)
            // Si no, guardar los últimos 2 (user + assistant)
            const sliceCount = messagesToSave.length > messages.length ? -3 : -2;
            await saveChat({
              chatSessionId: id,
              messages: (messagesToSave ?? []).slice(sliceCount),
            });
          }
        } catch (error) {
          console.error(logString + "Error guardando mensajes:", error);
        }
      },
    });
  } catch (error) {
    console.error("Error en API chat:", error);
    return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
    );
  }
}
