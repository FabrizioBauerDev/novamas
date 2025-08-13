"use client"

import { useState } from "react"
import FormularioEvaluacion from "./previous-form"
import NewChatInterface from "./new-chat-interface"

export default function ChatDemoContainer() {
  const [showChat, setShowChat] = useState(false)

  const handleFormComplete = () => {
    // Paso 1. Generar un nuevo ChatSession (ingresar el primer mensaje), y obtener la ID.
    // Paso 2. Setear la ID, pasar mensaje inicial y el nivel de riesgo al estado del componente (newChatInterface)
    setShowChat(true)
  }

  return (
    <>
      {!showChat ? (
        <FormularioEvaluacion onFormComplete={handleFormComplete} />
      ) : (
        <NewChatInterface/>
      )}
    </>
  )
}
