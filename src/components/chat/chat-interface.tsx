"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm" // Para soporte de tablas, tareas, etc.
import Link from "next/link" // Import Link component for handling markdown links

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy NoVa+, tu asistente virtual. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
    },
    {
      id: "2",
      text: "Hola NoVa+, me gustaría saber más sobre la adicción al juego. ¿Puedes darme algunos **recursos**?",
      sender: "user",
    },
    {
      id: "3",
      text: "Claro, la adicción al juego es un problema serio. Aquí tienes algunos recursos útiles:\n\n*   **Líneas de ayuda**: Puedes encontrar números de emergencia en nuestro [sitio web](/emergencia).\n*   **Artículos**: Tenemos una sección de [recursos](/recursos) con información detallada.\n*   **Grupos de apoyo**: Buscar grupos como Jugadores Anónimos puede ser muy beneficioso.\n\nRecuerda que no estás solo en esto. Si necesitas hablar con un especialista, puedes contactarnos.",
      sender: "bot",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false) // Declare isLoading state
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage.trim(),
        sender: "user",
      }
      setMessages((prevMessages) => [...prevMessages, newMessage])
      setInputMessage("")
      setIsLoading(true) // Set loading state to true

      // Simular respuesta del bot
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now().toString() + "-bot",
          text: `Has dicho: "${newMessage.text}". Estoy procesando tu solicitud.`,
          sender: "bot",
        }
        setMessages((prevMessages) => [...prevMessages, botResponse])
        setIsLoading(false) // Set loading state to false after response
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col flex-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Área de mensajes */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.sender === "bot" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <Bot className="w-5 h-5 text-gray-600" />
              </div>
            )}
            <div
              className={`max-w-[75%] p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-gray-900 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => {
                    const href = typeof props.href === "string" ? props.href : "/";
                    return (
                      <Link
                        href={href}
                        className="text-blue-400 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {props.children}
                      </Link>
                    );
                  },
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                  em: ({ node, ...props }) => <em className="italic" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
            {message.sender === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center ml-3">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Área de entrada de mensaje */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white flex items-center gap-2">
        <Input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:ring-gray-500 focus:border-gray-500"
          disabled={isLoading} // Deshabilitar input si hay una respuesta pendiente
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full bg-gray-900 hover:bg-gray-800"
          disabled={isLoading || !inputMessage.trim()}
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">Enviar mensaje</span>
        </Button>
      </form>
    </div>
  )
}
