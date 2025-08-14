"use client"

import { useState } from "react"
import FormularioEvaluacion from "./previous-form"
import NewChatInterface from "./new-chat-interface"

interface ChatDemoContainerProps {
  slug: string
}

export default function ChatDemoContainer({ slug }: ChatDemoContainerProps) {
  const [showChat, setShowChat] = useState(false)
  const [chatSessionId, setChatSessionId] = useState<string | null>(null)

  const handleFormComplete = () => {
    // El ID de sesión ya se estableció en setChatSessionId desde el formulario
    // Ver donde meter la pantalla de carga
    setShowChat(true)
  }

  return (
    <>
      {!showChat ? (
        <FormularioEvaluacion 
          onFormComplete={handleFormComplete} 
          setChatSessionID={setChatSessionId}
          slug={slug}
        />
      ) : (
        <NewChatInterface chatSessionId={chatSessionId} />
      )}
    </>
  )
}
