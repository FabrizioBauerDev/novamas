import ListView from "@/components/chatgroup/ListView"
import { auth } from "@/auth"

export default async function ChatGroupPage() {
  const session = await auth()
  const userRole = session?.user?.role
  const isStudent = userRole === "ESTUDIANTE"
  
  return <ListView isStudent={isStudent} />
}