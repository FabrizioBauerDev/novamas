import ChatDemoContainer from '@/components/chat/chat-demo-container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat con NoVa+',
  description: 'Conversa con NoVa+, tu asistente virtual para prevención y orientación sobre problematicas asociadas al juego online y apuestas. Obtén información, apoyo y recursos de ayuda.',
  keywords: ['chat IA', 'asistente virtual', 'adicción juego', 'prevención ludopatía', 'apoyo psicológico', 'conversación'],
  openGraph: {
    title: 'Chat con NoVa+ | Asistente Virtual',
    description: 'Conversa con NoVa+, tu asistente virtual para prevención de problemáticas asociadas al juego online.',
    type: 'website',
  }
};

export default async function Page() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col">
      <ChatDemoContainer slug="" />
    </div>
  )
}
