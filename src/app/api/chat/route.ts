import { google } from "@ai-sdk/google";
import {streamText, convertToModelMessages, createIdGenerator, tool, ToolSet} from "ai";
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
import {getRelevantInformation} from "@/lib/pgvector/utils";
import {z} from "zod";

// Permite respuestas de streaming hasta 30 segundos
export const maxDuration = 30;
/*
const tools: ToolSet = {
  getInformation: tool({
        description: `Utiliza la información obtenida de una base de conocimiento especializada cuando sea necesario.`,
        inputSchema: z.object({
          question: z.string().describe('pregunta del usuario'),
        }),
        execute: async ({ question }) => {
          try{
            // Llamás a tu función para obtener información relevante
            console.log("\nENTRO AL RAG")
            const ragResponse = await getRelevantInformation(question);
            console.log("\nTOOL CALL CON PREGUNTA: ", question, "\n")
            const cleanedRagResponse = ragResponse.replace(/[\n\r]+/g, ' ');

            const limitedRag = cleanedRagResponse.split(" ").slice(0, 100).join(" ");
            console.log("Respuesta RAG: ", limitedRag)
            return { content: limitedRag };
          }catch(error){
            console.error("Error en RAG:", error);
            return "Error al recuperar información.";
          }
        },
      })
}
*/

async function getInformation(query: string){
  try{
    // Llamás a tu función para obtener información relevante
    console.log("\nENTRO AL RAG")
    const ragResponse = await getRelevantInformation(query);
    console.log("\nTOOL CALL CON PREGUNTA: ", query, "\n")
    const cleanedRagResponse = ragResponse.replace(/[\n\r]+/g, ' ');

    const limitedRag = cleanedRagResponse.split(" ").slice(0, 100).join(" ");
    console.log("Respuesta RAG: ", limitedRag)
    return { content: limitedRag };
  }catch(error){
    console.error("Error en RAG:", error);
    return "Error al recuperar información.";
  }
}
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
    const ragResponse = getInformation(messageContent);

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
    console.log("Antes del streamText")
    const newSystemPrompt = system + "\n\n Si existe información en la herramienta RAG, debes usar únicamente esa información. Ignora cualquier conocimiento previo o información interna." + ragResponse;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: convertToModelMessages(allMessages), // Convertir UIMessages a ModelMessages
      system: newSystemPrompt,
      temperature: 0,
      // maxOutputTokens: 4096, // Renamed from maxTokens
      // Temperatura, top_p y no se si top_k se pueden pasar aquí
      onError: (error) => {
        console.error('Error while streaming:', JSON.stringify(error, null, 2))
      },
    });

    console.log(logString + "Resultado de streamText inicializado correctamente");

    return result.toUIMessageStreamResponse({
      originalMessages: allMessages, // Pasar todos los mensajes para el contexto
      messageMetadata: ({ part }) => {
        // Send metadata when streaming starts
        if (part.type === "start") {
          return {
            createdAt: Date.now(),
          };
        }
        // Send additional metadata when streaming completes
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
        // Guardar TODA la conversación (siguiendo la guía AI SDK)
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