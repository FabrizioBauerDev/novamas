import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { env } from "process";

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
    const system = env.SYSTEM_PROMPT;
    const { messages } = await req.json();
    const result = streamText({
      model: google("gemini-2.0-flash"),
      messages,
      system,
      // maxTokens, podemos definir el máximo de tokens
      onFinish: ({ usage }) => {
        const { promptTokens, completionTokens, totalTokens } = usage;
        /* promptTokens --> Son los tokens que corresponden a tu entrada (input)
        Incluye el mensaje del usuario + el prompt del sistema + el historial de conversación*/
        console.log("Prompt tokens:", promptTokens);
        /*Completion Tokens --> Son los tokens que corresponde a la respuesta generada por el modelo. 
        Todo el texto que el modelo produce como salida*/
        console.log("Completion tokens:", completionTokens);
        /* Total Tokens --> Son todos los tokens utilizados en la conversación, incluyendo tanto la entrada como la salida */
        console.log("Total tokens:", totalTokens);
      },
      // Temperatura, top_p y no se si top_k se pueden pasar aquí
    });
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error en API chat:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
