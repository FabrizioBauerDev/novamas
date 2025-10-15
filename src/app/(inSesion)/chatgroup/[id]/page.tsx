import ChatGroupDetailPage from "@/components/chatgroup/ChatGroupView"
import { auth } from "@/auth"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Grupo de Chat - ${id}`,
    description: 'Detalles y gestión del grupo de chat para investigación con NoVa+.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ChatGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth()
  const userRole = session?.user?.role
  const currentUserId = session?.user?.id
  const isStudent = userRole === "ESTUDIANTE"
  
  return <ChatGroupDetailPage id={id} isStudent={isStudent} currentUserId={currentUserId} />
}
