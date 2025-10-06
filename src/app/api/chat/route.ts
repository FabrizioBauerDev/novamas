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
  description: `Busca información relevante en la base de conocimiento especializada dependiendo la categoria especifica de informacion que necesites. 
    Usa esta herramienta cuando necesites información específica sobre temas académicos, 
    documentos o cualquier contenido que pueda estar almacenado en la base de datos de conocimiento.`,
  inputSchema: z.object({
    query: z.string().describe('Consulta del usuario'),
    category: z.enum(["ESTADISTICAS", "NUMERO_TELEFONO", "TECNICAS_CONTROL", "OTRO"])
  }),
  execute: async ({ query, category } ) => {
    try {
      // Validar que el query no esté vacío
      if (!query || query.trim() === "") {
        return "La consulta está vacía. Por favor, proporciona una pregunta específica para buscar en la base de conocimiento.";
      }
      console.log(category)
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
      return `Información encontrada en la base de conocimiento: ${limitedRag}
      Fuente: Base de conocimiento especializada`;
    } catch (error) {
      return `Error al acceder a la base de conocimiento: ${error instanceof Error ? error.message : "Error desconocido"}. Puedo ayudarte con información general si lo deseas.`;
    }
  },
});

export async function POST(req: Request) {

  try {
    const logString = "APP | API | CHAT | ROUTE - ";
    const system = env.SYSTEM_PROMPT;

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
    
    IMPORTANTE: Nunca dejes una respuesta vacía. Siempre genera texto después de usar herramientas.
    
    Cuando el usuario haga una consulta, antes de llamar al tool de búsqueda RAG,
    determiná internamente cuál es la categoría de información más adecuada según su intención.
    
    Las categorías válidas son:
    - ESTADISTICAS
    - NUMERO_TELEFONO
    - TECNICAS_CONTROL
    - OTRO
    
    Siempre generá un JSON con el siguiente formato:
    {
      "query": "(texto del usuario)",
      "category": "(una de las categorías)"
    }
    
    Si no estás seguro, usá "OTRO".
    
    Al obtener el resultado de la tool call, escribi tu respuesta basandote en la informacion obtenida 
`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: convertToModelMessages(allMessages),
      system: enhancedSystemPrompt,
      temperature: 0.1,
      // maxOutputTokens: 4096, // Renamed from maxTokens
      // Temperatura, top_p y no se si top_k se pueden pasar aquí
      tools: {
        searchKnowledgeBase: ragSearchTool,
      },
      stopWhen: stepCountIs(3),
      maxRetries: 2,
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
