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
} from "@/lib/db";
import { createWelcomeMessage } from "@/lib/chat-utils";
import { getRelevantInformation } from "@/lib/pgvector/utils";
import { z } from "zod";

// Permite respuestas de streaming hasta 30 segundos
export const maxDuration = 30;

// Definir la tool para búsqueda RAG
const ragSearchTool = tool({
  description: `Busca información relevante en la base de conocimiento especializada. 
    Usa esta herramienta cuando necesites información específica sobre temas académicos, 
    documentos o cualquier contenido que pueda estar almacenado en la base de datos de conocimiento.`,
  inputSchema: z.object({
    query: z.string().describe('La consulta o pregunta para buscar en la base de conocimiento'),
  }),
  execute: async ({ query }) => {
    try {
      console.log("\n🔍 RAG TOOL - Iniciando búsqueda con query:", query);
      console.log("🔍 RAG TOOL - Tipo de query:", typeof query);
      console.log("🔍 RAG TOOL - Query vacío?:", query === "" || query.trim() === "");
      
      // Validar que el query no esté vacío
      if (!query || query.trim() === "") {
        console.log("⚠️ RAG TOOL - Query vacío, retornando mensaje por defecto");
        return "La consulta está vacía. Por favor, proporciona una pregunta específica para buscar en la base de conocimiento.";
      }
      
      const ragResponse = await getRelevantInformation(query);
      
      console.log("\n📚 RAG TOOL - Respuesta RAW de getRelevantInformation:");
      console.log("📚 RAG TOOL - Tipo de respuesta:", typeof ragResponse);
      console.log("📚 RAG TOOL - Es null/undefined?:", ragResponse == null);
      console.log("📚 RAG TOOL - Longitud de respuesta:", ragResponse?.length || 0);
      console.log("📚 RAG TOOL - Respuesta vacía?:", !ragResponse || ragResponse.trim() === "");
      
      if (ragResponse && ragResponse.length > 0) {
        console.log("📚 RAG TOOL - Contenido (primeros 500 chars):", ragResponse.substring(0, 500) + (ragResponse.length > 500 ? "..." : ""));
      }
      
      // Verificar si la respuesta está vacía o es null/undefined
      if (!ragResponse || ragResponse.trim() === "") {
        console.log("⚠️ RAG TOOL - No se encontró información en la BD");
        return "No se encontró información relevante en la base de conocimiento para tu consulta. Puedo ayudarte con información general si lo deseas.";
      }
      
      // Limpiar la respuesta pero mantener más información
      const cleanedRagResponse = ragResponse.replace(/[\n\r]+/g, ' ').trim();
      
      // Verificar después de limpiar
      if (!cleanedRagResponse || cleanedRagResponse === "") {
        console.log("⚠️ RAG TOOL - Respuesta vacía después de limpiar");
        return "La información encontrada en la base de conocimiento no pudo ser procesada correctamente.";
      }
      
      // Aumentar el límite de palabras para conservar más contexto
      const limitedRag = cleanedRagResponse.split(" ").slice(0, 300).join(" ");
      
      console.log("\n✅ RAG TOOL - Información procesada exitosamente");
      console.log("✅ RAG TOOL - Palabras en respuesta final:", limitedRag.split(" ").length);
      console.log("✅ RAG TOOL - Respuesta final (primeros 200 chars):", limitedRag.substring(0, 200));
      
      return `Información encontrada en la base de conocimiento:

${limitedRag}

Fuente: Base de conocimiento especializada`;
      
    } catch (error) {
      console.error("\n❌ RAG TOOL - Error en búsqueda:", error);
      console.error("❌ RAG TOOL - Stack trace:", error instanceof Error ? error.stack : "No stack available");
      
      return `Error al acceder a la base de conocimiento: ${error instanceof Error ? error.message : "Error desconocido"}. Puedo ayudarte con información general si lo deseas.`;
    }
  },
});

export async function POST(req: Request) {
  // Verificar autenticación
  const session = await auth();
  if (!session || !session.user) {
    console.error("Error en API chatNova - No autorizado");
    return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión para usar el chat." },
        { status: 401 }
    );
  }

  try {
    const logString = "APP | API | CHAT | ROUTE - ";
    const system = env.SYSTEM_PROMPT;

    // Siguiendo la guía AI SDK: recibir solo el último mensaje cuando se optimiza
    const { message, id }: { message: MyUIMessage; id: string } =
        await req.json();

    const textParts = message.parts.filter(part => part.type === 'text');
    const messageContent = textParts.map(part => part.text).join('');
    console.log(logString + "Mensaje recibido:", messageContent);

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

    // Chequear el grupo de chat por ID
    if (chatSession.data?.chatGroupId) {
      const chatGroup = await checkChatGroupById(chatSession.data.chatGroupId);
      if (!chatGroup.success) {
        console.error(
            "Error en API chatNova - Grupo de chat no válido:",
            chatGroup.error
        );
        return NextResponse.json({ error: chatGroup.error }, { status: 400 });
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
    
    console.log("🚀 Iniciando streamText con tools habilitadas");

    // Sistema mejorado para trabajar con la tool RAG
    const enhancedSystemPrompt = `${system}

INSTRUCCIONES CRÍTICAS PARA USO DE HERRAMIENTAS:

1. **FLUJO OBLIGATORIO**: Para consultas académicas, técnicas o específicas:
   - PASO 1: Usa SIEMPRE searchKnowledgeBase primero
   - PASO 2: Analiza la respuesta de la herramienta
   - PASO 3: Genera tu respuesta basada en esa información

2. **RESPUESTA DESPUÉS DE HERRAMIENTAS**: 
   - Después de usar searchKnowledgeBase, SIEMPRE proporciona una respuesta de texto
   - Nunca termines sin responder al usuario
   - Explica lo que encontraste y cómo responde a su pregunta

3. **FORMATO DE RESPUESTA**:
   - Si encontraste información relevante: Úsala para responder
   - Si no encontraste información: Usa tu conocimiento general
   - SIEMPRE termina con texto explicativo para el usuario

4. **OBLIGATORIO**: Después de cualquier tool call, debes generar texto de respuesta.

EJEMPLO CORRECTO:
Usuario: "¿Qué es la adolescencia?"
1. [Usa searchKnowledgeBase]
2. [Responde]: "Basado en la información de la base de conocimiento..."

IMPORTANTE: Nunca dejes una respuesta vacía. Siempre genera texto después de usar herramientas.`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: convertToModelMessages(allMessages),
      system: enhancedSystemPrompt,
      temperature: 0.1,
      tools: {
        searchKnowledgeBase: ragSearchTool,
      },
      // Usar multi-step para asegurar que el modelo genere texto después de tool calls
      stopWhen: stepCountIs(3),
      maxRetries: 2,
      onError: (error) => {
        console.error('❌ Error while streaming:', JSON.stringify(error, null, 2))
      },
      onStepFinish: async (step) => {
        console.log("\n🔄 STEP FINISH - Step:", JSON.stringify(step, null, 2));
        console.log("🔄 STEP FINISH - Text:", step.text);
        console.log("🔄 STEP FINISH - Tool Calls:", step.toolCalls?.length || 0);
        console.log("🔄 STEP FINISH - Tool Results:", step.toolResults?.length || 0);
        
        if (step.toolCalls && step.toolCalls.length > 0) {
          step.toolCalls.forEach((toolCall, index) => {
            console.log(`🔧 Tool Call ${index} - Nombre:`, toolCall.toolName);
            console.log(`🔧 Tool Call ${index} - Input:`, JSON.stringify(toolCall.input, null, 2));
          });
        }
        
        if (step.toolResults && step.toolResults.length > 0) {
          step.toolResults.forEach((toolResult, index) => {
            console.log(`📤 Tool Result ${index} - Nombre:`, toolResult.toolName);
            console.log(`📤 Tool Result ${index} - Output tipo:`, typeof toolResult.output);
            console.log(`📤 Tool Result ${index} - Output:`, toolResult.output);
          });
        }
      },
    });

    console.log(logString + "Resultado de streamText inicializado correctamente con RAG tool");

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
            messageTokensIn: part.totalUsage.inputTokens,
            messageTokensOut: part.totalUsage.outputTokens,
            messageTokensReasoning: part.totalUsage.reasoningTokens || 0,
          };
        }
      },
      onFinish: async ({ messages }) => {
        try {
          console.log("\n🏁 STREAM FINISHED:");
          console.log("🏁 Number of messages:", messages?.length || 0);
          
          // Verificar si tenemos mensajes válidos
          if (messages && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            console.log("🏁 Last message role:", lastMessage.role);
            console.log("🏁 Last message parts:", lastMessage.parts?.length || 0);
            
            if (lastMessage.role === 'assistant' && lastMessage.parts) {
              const textParts = lastMessage.parts.filter(part => part.type === 'text');
              console.log("🏁 Text parts found:", textParts.length);
              textParts.forEach((part, index) => {
                console.log(`🏁 Text part ${index}:`, part.text?.substring(0, 100) || 'EMPTY');
              });
              
              // Verificar si hay tool calls
              const toolParts = lastMessage.parts.filter(part => part.type.startsWith('tool'));
              console.log("🏁 Tool parts found:", toolParts.length);
              toolParts.forEach((part, index) => {
                console.log(`🏁 Tool part ${index} type:`, part.type);
              });
            }
          }
          
          if (welcomeMessage) {
            await saveChat({
              chatSessionId: id,
              messages,
            });
          } else {
            await saveChat({
              chatSessionId: id,
              messages: (messages ?? []).slice(-2),
            });
          }
          console.log("💾 Mensajes guardados correctamente en la BD");
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
