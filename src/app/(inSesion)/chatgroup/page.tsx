import ListView from "@/components/chatgroup/ListView"
import { auth } from "@/auth"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Grupos de Chat',
  description: 'Gestión de grupos de chat para investigación. Crea, administra y monitorea grupos de conversaciones con NoVa+.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ChatGroupPage() {
  const session = await auth()
  const userRole = session?.user?.role
  const isStudent = userRole === "ESTUDIANTE"
  
  return <ListView isStudent={isStudent} />
}