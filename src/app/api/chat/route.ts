import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, createIdGenerator } from "ai";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { env } from "process";
import { MyUIMessage } from "@/types/types";

// Permite respuestas de streaming hasta 30 segundos
export const maxDuration = 30;

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
    const { messages }: { messages: MyUIMessage[] } = await req.json();
    const result = streamText({
      model: google("gemini-2.0-flash"),
      messages: convertToModelMessages(messages), // Convert UIMessages to ModelMessages
      system,
      // maxOutputTokens: 4096, // Renamed from maxTokens
      onFinish: ({ usage }) => {
        const { inputTokens, outputTokens, totalTokens } = usage; // Property names changed

        /* inputTokens --> Son los tokens que corresponden a tu entrada (input)
           Incluye el mensaje del usuario + el prompt del sistema + el historial de conversación */
        console.log(logString + "Input tokens:", inputTokens); // Renamed from promptTokens

        /* outputTokens --> Son los tokens que corresponde a la respuesta generada por el modelo.
           Todo el texto que el modelo produce como salida */
        console.log(logString + "Output tokens:", outputTokens); // Renamed from completionTokens

        /* totalTokens --> Son todos los tokens utilizados en la conversación, incluyendo tanto la entrada como la salida */
        console.log(logString + "Total tokens:", totalTokens);
      },
      // Temperatura, top_p y no se si top_k se pueden pasar aquí
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages, // pass this in for type-safe return objects
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
      generateMessageId: createIdGenerator({
        prefix: 'msg',
        size: 16,
      }),
      onFinish: ({ messages }) => {
        // almacenar mensaje en la base de datos
      },
    });
    // Si es del usuario hay que ver como hacer para guardar los tokens
  } catch (error) {
    console.error("Error en API chat:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
