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

const tools: ToolSet = {
  getInformation: tool({
        description: `Utiliza la información obtenida de una base de conocimiento especializada cuando sea necesario.`,
        inputSchema: z.object({
          question: z.string().describe('pregunta del usuario'),
        }),
        execute: async ({ question }) => {
          // Llamás a tu función para obtener información relevante
          const ragResponse = await getRelevantInformation(question);
          console.log("\nTOOL CALL CON PREGUNTA: ", question, "\n")
          console.log("Respuesta RAG: ", ragResponse)
          return ragResponse;
        },
      })
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

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: convertToModelMessages(allMessages), // Convertir UIMessages a ModelMessages
      system,
      // maxOutputTokens: 4096, // Renamed from maxTokens
      // onFinish: ({ usage }) => {
      //   const { inputTokens, outputTokens, totalTokens } = usage; // Property names changed

      //   /* inputTokens --> Son los tokens que corresponden a tu entrada (input)
      //      Incluye el mensaje del usuario + el prompt del sistema + el historial de conversación */
      //   console.log(logString + "Input tokens:", inputTokens); // Renamed from promptTokens

      //   /* outputTokens --> Son los tokens que corresponde a la respuesta generada por el modelo.
      //      Todo el texto que el modelo produce como salida */
      //   console.log(logString + "Output tokens:", outputTokens); // Renamed from completionTokens

      //   /* totalTokens --> Son todos los tokens utilizados en la conversación, incluyendo tanto la entrada como la salida */
      //   console.log(logString + "Total tokens:", totalTokens);
      // },
      // Temperatura, top_p y no se si top_k se pueden pasar aquí
      tools,
    });

    result.consumeStream();

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
          console.log("Streaming finished | ", part);
          return {
            // Si es del asistente el outputTokens tiene los tokens del mensaje
            messageTokens: part.totalUsage.outputTokens,
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