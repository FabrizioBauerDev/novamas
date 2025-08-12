'use client';

import type { UIMessage } from '@ai-sdk/react'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { Loader } from '@/components/ai-elements/loader';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Response } from '@/components/ai-elements/response';
import { Bot, User } from 'lucide-react';

const ConversationDemo = () => {
  const [input, setInput] = useState('');
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  // Función para formatear timestamp
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-[calc(100vh-9rem)] max-h-[600px] flex flex-col rounded-lg shadow-lg border border-gray-200 bg-white overflow-hidden">
      <div className="flex flex-col h-full ">
        <Conversation className="flex-1 overflow-hidden">
          <ConversationContent>
            {messages.map((message : UIMessage) => (
              <div key={message.id}>
                <Message from={message.role}>
                  {/* Layout diferente para usuario vs asistente */}
                  <div className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        {message.role === 'user' ? (
                          <User size={16} className="text-white" />
                        ) : (
                          <Bot size={16} className="text-white" />
                        )}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        {message.role === 'user' ? 'Tú' : 'NoVa+'}
                      </div>
                    </div>
                    
                    {/* Contenido del mensaje */}
                    <div className="flex-1 min-w-0">
                      <MessageContent>
                        {message.parts.map((part, i) => {
                          switch (part.type) {
                            case 'text':
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
                    </div>
                  </div>
                </Message>
              </div>
            ))}

            {/* Estados de carga */}
            {status === 'submitted' && (
              <div className="mb-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
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

            {status === 'streaming' && (
              <div className="mb-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
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
              status={status === 'streaming' ? 'streaming' : 'ready'}
              disabled={!input.trim() || status === 'submitted' || status === 'streaming'}
              className="mr-2"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConversationDemo;