import CreateForm from "@/components/chatgroup/CreateForm"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function CreateChatGroupPage() {
  const session = await auth()
  
  // Verificar si el usuario es estudiante y redirigir si es necesario
  if (session?.user?.role === "ESTUDIANTE") {
    redirect("/chatgroup")
  }

  return <CreateForm />
}
