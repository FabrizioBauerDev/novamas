import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { env } from 'process';

// Permite respuestas de streaming hasta 30 segundos
export const maxDuration = 30;

export async function POST(req: Request) {
  // Verificar autenticación
  const session = await auth();
  
  if (!session || !session.user) {
    console.error('Error en API chatNova - No autorizado');
    return NextResponse.json(
      { error: 'No autorizado. Debes iniciar sesión para usar el chat.' },
      { status: 401 }
    );
  }

  try {
    const system = env.SYSTEM_PROMPT;
    const { messages } = await req.json();
    // Unir el system prompt con los mensajes
    messages.unshift({ role: 'user', content: system });
    // Se puede pasar system como una variable de streamText
    // pero Gemma no lo soporta directamente, así que se maneja en la API
    // y se une al mensaje del usuario antes de enviarlo a la IA
    const result = streamText({
      model: google('gemma-3-27b-it'),
      messages,
      // async onFinish({ response }) {
      //   await saveChat({
      //     id,
      //     messages: appendResponseMessages({
      //       messages,
      //       responseMessages: response.messages,
      //     }),
      //   });
      // },
      // Temperatura, top_p y no se si top_k se pueden pasar aquí
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error en API chat:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}