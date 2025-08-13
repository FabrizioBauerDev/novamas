"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageAvatar,
} from "@/components/ai-elements/message";
import {
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Loader } from "@/components/ai-elements/loader";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { Bot, User } from "lucide-react";
import { MyUIMessage } from "@/types/types";
import { DefaultChatTransport } from "ai";


const ConversationDemo = () => {
  const sessionId = "cafb3bc7-f5a0-4bfa-abb8-ab8f5619af1c"; // ID ESTÁTICA DE MOMENTO
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat<MyUIMessage>({
    id: sessionId,
    messages: [
      {
        id: "1", //Generar ID único
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "¡Hola! Soy NoVa+, tu asistente virtual. ¿En qué puedo ayudarte hoy?",
          },
        ],
        metadata: {
          createdAt: Date.now(),
        },
      },
    ],
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full py-4 px-4">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
        Bienvenido al chat con NoVa+
      </h1>
      <div className="flex-1 flex flex-col">
        <div className="h-[calc(100vh-9rem)] max-h-dvh rounded-lg shadow-lg border border-gray-200 bg-white overflow-hidden">
          <div className="flex flex-col h-full ">
            <Conversation className="flex-1 overflow-hidden">
              <ConversationContent>
                {messages.map((message: MyUIMessage) => (
                  <div key={message.id}>
                    <Message from={message.role} className="py-1">
                      {/* Layout diferente para usuario vs asistente */}
                      <div
                        className={`flex items-start gap-3 ${
                          message.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <MessageAvatar
                            src={
                              message.role === "user"
                                ? "/icon-chat-user.png"
                                : "/icon-chat-nova+.jpeg"
                            }
                            name={message.role === "user" ? "Tú" : "NoVa+"}
                          />
                          <div className="text-xs text-gray-600 font-medium">
                            {message.role === "user" ? "Tú" : "NoVa+"}
                          </div>
                        </div>

                        {/* Contenido del mensaje */}
                        <div className="flex-1 min-w-0 group">
                          <MessageContent>
                            {message.parts.map((part, i) => {
                              switch (part.type) {
                                case "text":
                                  return (
                                    <Response key={`${message.id}-${i}`}>
                                      {part.text}
                                    </Response>
                                  );
                                default:
                                  return null;
                              }
                            })}
                          </MessageContent>
                          {/* Timestamp debajo del mensaje */}
                          {message.metadata?.createdAt && (
                            <div
                              className={`mt-1 ${
                                message.role === "user"
                                  ? "text-right"
                                  : "text-left"
                              }`}
                            >
                              <span className="text-xs text-gray-400">
                                {new Date(
                                  message.metadata.createdAt
                                ).toLocaleTimeString("es-ES", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Message>
                  </div>
                ))}
                {/* Estados de carga */}
                {status === "submitted" && (
                  <div className="mb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <MessageAvatar
                          src="/icon-chat-nova+.jpeg"
                          name="NoVa+"
                        />
                        <div className="text-xs text-gray-600 font-medium">
                          NoVa+
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Loader />
                          <span>NoVa+ está pensando...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {status === "streaming" && (
                  <div className="mb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <MessageAvatar src="/nova-avatar.png" name="NoVa+" />
                        <div className="text-xs text-gray-600 font-medium">
                          NoVa+
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Loader />
                          <span>NoVa+ está escribiendo...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            <div className="flex-shrink-0 p-4 border-t">
              <form
                onSubmit={handleSubmit}
                className="flex w-full items-center rounded-xl border bg-white"
              >
                <PromptInputTextarea
                  value={input}
                  placeholder="Escribe tu mensaje..."
                  onChange={(e) => setInput(e.currentTarget.value)}
                  className="flex-1"
                  maxLength={280}
                />
                <PromptInputSubmit
                  status={status === "streaming" ? "streaming" : "ready"}
                  disabled={
                    !input.trim() ||
                    status === "submitted" ||
                    status === "streaming"
                  }
                  className="mr-2"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NewChatInterface() {
  return <ConversationDemo/>
}
