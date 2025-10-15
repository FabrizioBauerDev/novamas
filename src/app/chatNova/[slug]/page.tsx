import ChatSessionValidator from '@/components/chat/chat-session-validator';
import { Metadata } from 'next';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  
  return {
    title: `Chat - Sesión Grupal ${slug}`,
    description: 'Conversa con NoVa+ en tu sesión grupal, el asistente virtual para prevención y orientación sobre problematicas asociadas al juego online y apuestas. Obtén información, apoyo y recursos de ayuda.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  return <ChatSessionValidator slug={slug} />;
}
