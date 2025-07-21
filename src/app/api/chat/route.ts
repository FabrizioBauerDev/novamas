import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Permite respuestas de streaming hasta 30 segundos
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemma-3-27b-it'),
    messages
  });

  return result.toDataStreamResponse();
}