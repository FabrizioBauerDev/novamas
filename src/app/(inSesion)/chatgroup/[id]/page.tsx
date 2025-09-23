import ChatGroupDetailPage from "@/components/chatgroup/ChatGroupView"
import { auth } from "@/auth"

export default async function ChatGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth()
  const userRole = session?.user?.role
  const currentUserId = session?.user?.id
  const isStudent = userRole === "ESTUDIANTE"
  
  return <ChatGroupDetailPage id={id} isStudent={isStudent} currentUserId={currentUserId} />
}
