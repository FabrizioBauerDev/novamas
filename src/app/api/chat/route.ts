import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

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
    const { messages } = await req.json();

    const result = streamText({
      model: google('gemma-3-27b-it'),
      messages
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