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
    // +++++ CON GEMMA +++++
    // Unir el system prompt con los mensajes
    // messages.unshift({ role: 'user', content: system });

    // +++++ CON GEMINI 2.0 FLASH +++++
    // Pasamos el system prompt como un parametro
    // adicionaly no lo unimos a los mensajes

    const result = streamText({
      model: google('gemini-2.0-flash'),
      messages,
      system,
      // async onFinish({ response }) {
      //   await saveChat({
      //     id,
      //     messages: appendResponseMessages({
      //       messages,
      //       responseMessages: response.messages,
      //     }),
      //   });
      // },
      onFinish: ({ usage }) => {
      const { promptTokens } = usage;
      // Guardar en algún lado los prompt tokens?
      console.log('Prompt tokens:', promptTokens);
    },
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