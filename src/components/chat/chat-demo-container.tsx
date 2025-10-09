"use client"

import { useState, useEffect } from "react"
import FormularioEvaluacion from "./previous-form"
import NewChatInterface from "./new-chat-interface"
import EvaluationForm from "./evaluation-form"
import { getSessionDataAction } from "@/lib/actions/actions-chat"

interface ChatDemoContainerProps {
  slug: string
}

interface SessionData {
  createdAt: string;
  chatGroupId: string | null;
  maxDurationMs: number;
  usedGraceMessage: boolean;
  groupEndDate: string | null;
}

type ViewState = "form" | "chat" | "evaluation"

export default function ChatDemoContainer({ slug }: ChatDemoContainerProps) {
  const [currentView, setCurrentView] = useState<ViewState>("form")
  const [chatSessionId, setChatSessionId] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(false)

  const handleFormComplete = async () => {
    if (!chatSessionId) {
      console.error("No hay ID de sesión disponible")
      return
    }

    // Cargar datos de la sesión antes de mostrar el chat
    setIsLoadingSession(true)
    try {
      const result = await getSessionDataAction(chatSessionId)
      
      if (result.success && result.data) {
        setSessionData({
          createdAt: result.data.createdAt,
          chatGroupId: result.data.chatGroupId,
          maxDurationMs: result.data.maxDurationMs,
          usedGraceMessage: result.data.usedGraceMessage,
          groupEndDate: result.data.groupEndDate || null,
        })
        setCurrentView("chat")
      } else {
        console.error("Error cargando datos de sesión:", result.error)
        alert("Hubo un error al cargar la sesión. Por favor intenta nuevamente.")
      }
    } catch (error) {
      console.error("Error al cargar datos de sesión:", error)
      alert("Hubo un error al cargar la sesión. Por favor intenta nuevamente.")
    } finally {
      setIsLoadingSession(false)
    }
  }

  const handleChatFinish = () => {
    setCurrentView("evaluation")
  }

  // Renderizado condicional basado en el estado actual
  if (isLoadingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando chat...</p>
        </div>
      </div>
    )
  }

  if (currentView === "form") {
    return (
      <FormularioEvaluacion 
        onFormComplete={handleFormComplete} 
        setChatSessionID={setChatSessionId}
        slug={slug}
      />
    )
  }

  if (currentView === "chat") {
    return (
      <NewChatInterface 
        chatSessionId={chatSessionId}
        sessionData={sessionData}
        isGroupSession={slug !== ""}
        onFinish={handleChatFinish}
      />
    )
  }

  if (currentView === "evaluation") {
    return (
      <EvaluationForm chatSessionId={chatSessionId || ""} />
    )
  }

  return null
}
