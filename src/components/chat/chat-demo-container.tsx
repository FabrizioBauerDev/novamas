"use client"

import { useState } from "react"
import FormularioEvaluacion from "./previous-form"
import NewChatInterface from "./new-chat-interface"

export default function ChatDemoContainer() {
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
        />
      ) : (
        <NewChatInterface chatSessionId={chatSessionId} />
      )}
    </>
  )
}
