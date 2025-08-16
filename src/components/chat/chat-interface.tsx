"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import type { UIMessage } from '@ai-sdk/react'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Link from "next/link" 

export default function ChatInterface() {
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  
  const { messages, sendMessage, status } = useChat({
    messages: [
      {
        id: "1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "¡Hola! Soy NoVa+, tu asistente virtual. ¿En qué puedo ayudarte hoy?"
          }
        ],
      },
    ],
    transport: new DefaultChatTransport({
      api: '/api/chat'
    })
  })

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, status])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage({ text: input })
      setInput('')
    }
  }

  const renderMessageContent = (message: UIMessage) => {
    return message.parts.map((part, index) => {
      if (part.type === 'text') {
        return (
          <ReactMarkdown
            key={index}
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ ...props }) => {
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
              ul: ({ ...props }) => <ul className="list-disc list-inside" {...props} />,
              ol: ({ ...props }) => <ol className="list-decimal list-inside" {...props} />,
              strong: ({ ...props }) => <strong className="font-semibold" {...props} />,
              em: ({ ...props }) => <em className="italic" {...props} />,
              p: ({ ...props }) => <p className="mb-1 last:mb-0" {...props} />,
            }}
          >
            {part.text}
          </ReactMarkdown>
        )
      }
      // Handle other part types if needed
      return null
    })
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Área de mensajes */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[calc(100vh-200px)]"
      >
        {messages.map((message: UIMessage) => (
          <div
            key={message.id}
            className={`flex items-start ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <Bot className="w-5 h-5 text-gray-600" />
              </div>
            )}
            <div
              className={`max-w-[75%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-gray-900 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {renderMessageContent(message)}
            </div>
            {message.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center ml-3">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {/* Indicador de carga */}
        {(status === 'submitted' || status === 'streaming') && (
          <div className="flex items-start justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <Bot className="w-5 h-5 text-gray-600" />
            </div>
            <div className="max-w-[75%] p-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  {status === 'streaming' ? 'NoVa+ está escribiendo...' : 'NoVa+ está pensando...'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Área de entrada de mensaje */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white flex items-center gap-2">
        <Input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:ring-gray-500 focus:border-gray-500"
          disabled={status === 'submitted' || status === 'streaming'}
          maxLength={280}
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full bg-gray-900 hover:bg-gray-800"
          disabled={status === 'submitted' || status === 'streaming' || input.trim().length === 0}
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">Enviar mensaje</span>
        </Button>
      </form>
    </div>
  )
}