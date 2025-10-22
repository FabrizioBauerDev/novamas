import ChatGroupStatsView from "@/components/statistics/ChatGroupStatsView";
import { Metadata } from "next";
import {auth} from "@/auth";
import {toast} from "sonner";
import {GeneralView} from "@/components/statistics/GeneralView";

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
    const session = await auth()
    const userName = session?.user?.name
    if(userName === undefined || userName === null){
      return (
        toast.error("Error al obtener el nombre del usuario")
      )
    }

    return <ChatGroupStatsView chatGroupId={chatGroupId} currentUser={userName}/>
}
