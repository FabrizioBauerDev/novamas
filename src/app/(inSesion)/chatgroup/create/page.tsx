import CreateForm from "@/components/chatgroup/CreateForm"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Crear Grupo de Chat',
  description: 'Crea un nuevo grupo de chat para investigación con NoVa+. Define participantes y parámetros del grupo.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CreateChatGroupPage() {
  const session = await auth()
  
  // Verificar si el usuario es estudiante y redirigir si es necesario
  if (session?.user?.role === "ESTUDIANTE") {
    redirect("/chatgroup")
  }

  return <CreateForm />
}
