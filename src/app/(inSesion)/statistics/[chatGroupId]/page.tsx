import ChatGroupStatsView from "@/components/statistics/ChatGroupStatsView";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ chatGroupId: string }> }): Promise<Metadata> {
  const { chatGroupId } = await params;
  
  return {
    title: `Estadísticas - Grupo ${chatGroupId}`,
    description: 'Estadísticas detalladas y análisis de conversaciones del grupo de chat con NoVa+.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ChatGroupStatsPage({ params }: { params: Promise<{ chatGroupId: string  }> }) {
    const { chatGroupId } = await params;

    return <ChatGroupStatsView chatGroupId={chatGroupId}/>
}
