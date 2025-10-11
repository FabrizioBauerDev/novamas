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
import { useState, useEffect, useCallback, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { MyUIMessage } from "@/types/types";
import { DefaultChatTransport } from "ai";
import { createWelcomeMessage } from "@/lib/chat-utils";
import { FeedbackCard } from "./feedback-card";
import { SessionTimer } from "./session-timer";
import { finalizeChatSessionAction } from "@/lib/actions/actions-chat";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface NewChatInterfaceProps {
  chatSessionId: string | null;
  sessionData: {
    createdAt: string;
    chatGroupId: string | null;
    maxDurationMs: number;
    usedGraceMessage: boolean;
    groupEndDate: string | null;
  } | null;
  isGroupSession: boolean;
  onFinish?: () => void;
}

const ConversationDemo = ({
  chatSessionId,
  sessionData: initialSessionData,
  isGroupSession,
  onFinish,
}: {
  chatSessionId: string | null;
  sessionData: {
    createdAt: string;
    chatGroupId: string | null;
    maxDurationMs: number;
    usedGraceMessage: boolean;
    groupEndDate: string | null;
  } | null;
  isGroupSession: boolean;
  onFinish?: () => void;
}) => {
  const sessionId = chatSessionId || "default-session-id"; // Fallback si no hay ID
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [graceMessageUsed, setGraceMessageUsed] = useState(false);
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningShown, setWarningShown] = useState(false);
  const [autoRedirectStarted, setAutoRedirectStarted] = useState(false);
  const [feedbackFormVisible, setFeedbackFormVisible] = useState(true);
  
  // Usar useRef para sincronización inmediata y evitar llamadas duplicadas
  const hasCalledExpireAPIRef = useRef(false);

  const { messages, sendMessage, status, error, setMessages } = useChat<MyUIMessage>({
    id: sessionId,
    messages: [
      createWelcomeMessage() as MyUIMessage, // Usar la función global
    ],
    transport: new DefaultChatTransport({
      api: "/api/chat",
      // SOLO ENVIAR EL ÚLTIMO MENSAJE AL SERVIDOR (siguiendo guía AI SDK)
      prepareSendMessagesRequest({ messages, id }) {
        return { body: { message: messages[messages.length - 1], id } };
      },
    }),
    onError: (error) => {
      // Capturar error de tiempo expirado después de usar mensaje de gracia
      if (error.message?.includes("TIEMPO_EXPIRADO") || error.message?.includes("403")) {
        setGraceMessageUsed(true);
      }
    },
    onFinish: async () => {
      // Después de cada respuesta, verificar si necesitamos recargar mensajes
      // (para capturar el mensaje de gracia que se añade en el backend)
      if (initialSessionData) {
        const { getChatMessagesAction } = await import("@/lib/actions/actions-chat");
        const result = await getChatMessagesAction(sessionId);
        if (result.success && result.data) {
          setMessages(result.data as MyUIMessage[]);
        }
      }
    },
  });

  // Función para manejar la expiración del timer
  // Usar useRef para sincronización inmediata y evitar llamadas duplicadas
  const handleTimerExpire = useCallback(async () => {
    // Verificación síncrona con useRef para evitar race conditions
    if (hasCalledExpireAPIRef.current) {
      console.log("⛔ handleTimerExpire bloqueado:", { 
        hasCalledExpireAPI: hasCalledExpireAPIRef.current 
      });
      return;
    }
    // Marcar inmediatamente como llamado (sincrónico)
    hasCalledExpireAPIRef.current = true;
    console.log("✅ handleTimerExpire ejecutándose para sesión:", sessionId);
    try {
      // Llamar a la API para añadir el mensaje de expiración
      const response = await fetch("/api/chat/expire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Recargar todos los mensajes desde la base de datos
        // para asegurar sincronización completa
        if (data.success && !data.alreadyExists) {
          const { getChatMessagesAction } = await import("@/lib/actions/actions-chat");
          const result = await getChatMessagesAction(sessionId);
          if (result.success && result.data) {
            setMessages(result.data as MyUIMessage[]);
          }
        } else if (data.alreadyExists) {
          console.log("ℹ️ Mensaje de expiración ya existe, no se añade duplicado");
        }

        // Marcar como expirado (pero permitir mensaje de gracia)
        setSessionExpired(true);
        setShowTimeoutDialog(true);
      }
    } catch (error) {
      console.error("❌ Error al llamar API de expiración:", error);
      // En caso de error, permitir reintentar
      hasCalledExpireAPIRef.current = false;
    }
  }, [sessionId, setMessages]);

  // Detectar cuando llega el mensaje de gracia usado (después de enviar el último mensaje)
  useEffect(() => {
    // Buscar si el último mensaje del asistente es el mensaje de gracia usado
    const lastAssistantMessage = messages
      .filter(m => m.role === "assistant")
      .pop();

    if (lastAssistantMessage) {
      const hasGraceUsedText = lastAssistantMessage.parts.some(
        part => part.type === "text" && part.text.includes("Has utilizado tu mensaje de gracia")
      );

      if (hasGraceUsedText && !autoRedirectStarted) {
        setGraceMessageUsed(true); // Marcar que usó el mensaje de gracia
        setAutoRedirectStarted(true); // Activar el auto-redirect de 1 minuto
      }
    }
  }, [messages, autoRedirectStarted]);

  // Mostrar advertencia cuando quedan 2 minutos
  useEffect(() => {
    if (!initialSessionData || warningShown) {
      return;
    }

    const checkTimeRemaining = () => {
      let remaining: number;
      
      if (isGroupSession && initialSessionData.groupEndDate) {
        // Para sesiones grupales, calcular desde el endDate
        const endDate = new Date(initialSessionData.groupEndDate);
        remaining = endDate.getTime() - Date.now();
      } else {
        // Para sesiones individuales, usar maxDurationMs
        const createdAt = new Date(initialSessionData.createdAt);
        const maxDuration = initialSessionData.maxDurationMs || 1200000;
        const elapsed = Date.now() - createdAt.getTime();
        remaining = maxDuration - elapsed;
      }
      
      // Mostrar advertencia cuando quedan 2 minutos (120000 ms)
      if (remaining <= 120000 && remaining > 0 && !warningShown) {
        setShowWarningDialog(true);
        setWarningShown(true);
      }
    };

    // Chequear cada 5 segundos
    const interval = setInterval(checkTimeRemaining, 5000);
    
    // Chequear inmediatamente también
    checkTimeRemaining();

    return () => clearInterval(interval);
  }, [initialSessionData, isGroupSession, warningShown]);

  /**
   * Maneja la finalización manual del chat
   */
  const handleFinishChat = async () => {
    // Evitar múltiples ejecuciones
    if (isFinishing) {
      return;
    }
    
    setIsFinishing(true);
    
    try {
      // Marcar sesión como finalizada en BD usando Server Action
      const result = await finalizeChatSessionAction(sessionId);
      
      if (result.success) {
        // Llamar al callback del contenedor para cambiar de vista
        if (onFinish) {
          onFinish();
        }
      } else {
        alert("Hubo un error al finalizar el chat. Por favor intenta nuevamente.");
        setIsFinishing(false);
      }
    } catch (error) {
      alert("Hubo un error al finalizar el chat. Por favor intenta nuevamente.");
      setIsFinishing(false);
    }
  };

  // Auto-redirect después de que la sesión expire (1 minuto)
  // Usamos un estado separado para que cerrar el modal no cancele el timer
  useEffect(() => {
    if (autoRedirectStarted && !isFinishing) {
      const timer = setTimeout(() => {
        handleFinishChat();
      }, 60000); // 1 minuto

      // Solo limpiar si el componente se desmonta
      return () => {
        clearTimeout(timer);
      };
    }
  }, [autoRedirectStarted, isFinishing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();

    // PREVENCIÓN DE SPAM
    if (status === "submitted" || status === "streaming") {
      console.log("⛔ Intento de enviar mensaje mientras hay una petición en curso");
      return;
    }
    
    // Bloquear si ya se usó el mensaje de gracia
    if (graceMessageUsed) {
      console.log("⛔ Intento de enviar mensaje después de usar mensaje de gracia");
      return;
    }

    // Validación del lado del cliente
    if (!trimmedInput) {
      return;
    }

    if (trimmedInput.length > 280) {
      alert("El mensaje no puede exceder los 280 caracteres.");
      return;
    }

    // Añadir metadata con timestamp al enviar el mensaje
    sendMessage({ 
      text: trimmedInput,
      metadata: {
        createdAt: Date.now()
      }
    });
    setInput("");
  };

  // Calcular el número de mensajes del usuario (excluyendo el mensaje de bienvenida)
  const userMessageCount = messages.filter(msg => msg.role === "user").length;

  return (
    <div className="w-full py-4 px-4">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
        Bienvenido al chat con NoVa+
      </h1>

      {/* Grid layout para desktop: 10 columnas (chat) + 2 columnas (feedback) */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-4">
        {/* Chat - columnas 1-10 (10 columnas) */}
        <div className="col-span-10 h-[calc(100vh-9rem)] max-h-dvh rounded-lg shadow-lg border border-gray-200 bg-white overflow-hidden">
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
                            {/* Estados de carga - solo en el último mensaje del asistente */}
                            {message.role === "assistant" &&
                              message.id ===
                                messages[messages.length - 1]?.id &&
                              (status === "submitted" ||
                                status === "streaming") && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                  <Loader />
                                  <span>NoVa+ está pensando...</span>
                                </div>
                              )}
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
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            <div className="flex-shrink-0 p-4 border-t">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full rounded-xl border bg-white"
              >
                <div className="flex w-full items-center">
                  <PromptInputTextarea
                    value={input}
                    placeholder={
                      graceMessageUsed
                        ? "Has usado tu último mensaje, serás redirigido en 1 minuto si no pulsas \"Finalizar Sesión\"."
                        : sessionExpired
                        ? "Puedes enviar un último mensaje."
                        : "Escribe tu mensaje..."
                    }
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      // Validación en tiempo real: limitar a 280 caracteres
                      if (value.length <= 280) {
                        setInput(value);
                      }
                    }}
                    disabled={graceMessageUsed}
                    className="flex-1"
                    maxLength={280}
                  />
                  <PromptInputSubmit
                    status={status === "streaming" ? "streaming" : "ready"}
                    disabled={
                      !input.trim() ||
                      input.length > 280 ||
                      status === "submitted" ||
                      status === "streaming" ||
                      graceMessageUsed
                    }
                    className="mr-2"
                  />
                </div>
                <div className="px-3 pb-2 text-xs text-right text-gray-500">
                  {input.length}/280
                </div>
              </form>
              
              {/* Advertencia debajo del textarea - desktop */}
              <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
                <p className="text-xs text-amber-800 text-center">
                  Recuerda que solo es un asistente con <strong>inteligencia artificial</strong>, no reemplaza a un profesional ni a una persona física.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback card a la derecha - columnas 11-12 */}
        <div className="col-span-2">
          <div className="sticky top-4 space-y-4">
            <SessionTimer
              createdAt={initialSessionData?.createdAt ? new Date(initialSessionData.createdAt) : null}
              maxDurationMs={initialSessionData?.maxDurationMs}
              groupEndDate={initialSessionData?.groupEndDate ? new Date(initialSessionData.groupEndDate) : null}
              isGroupSession={isGroupSession}
              messageCount={userMessageCount}
              onFinish={handleFinishChat}
              isFinishing={isFinishing}
              onExpire={handleTimerExpire}
            />
            <FeedbackCard 
              chatSessionId={sessionId} 
              isVisible={feedbackFormVisible}
              onHide={() => setFeedbackFormVisible(false)}
            />
          </div>
        </div>
      </div>

      {/* Layout para móviles - sin grid */}
      <div className="md:hidden flex flex-col gap-4">
        <div className="h-[calc(100vh-25rem)] max-h-dvh rounded-lg shadow-lg border border-gray-200 bg-white overflow-hidden">
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
                            {/* Estados de carga - solo en el último mensaje del asistente */}
                            {message.role === "assistant" &&
                              message.id ===
                                messages[messages.length - 1]?.id &&
                              (status === "submitted" ||
                                status === "streaming") && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                  <Loader />
                                  <span>NoVa+ está pensando...</span>
                                </div>
                              )}
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
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            <div className="flex-shrink-0 p-4 border-t">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full rounded-xl border bg-white"
              >
                <div className="flex w-full items-center">
                  <PromptInputTextarea
                    value={input}
                    placeholder={
                      graceMessageUsed
                        ? "Has usado tu último mensaje, serás redirigido en 1 minuto si no pulsas \"Finalizar Sesión\"."
                        : sessionExpired
                        ? "Puedes enviar un último mensaje."
                        : "Escribe tu mensaje..."
                    }
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      // Validación en tiempo real: limitar a 280 caracteres
                      if (value.length <= 280) {
                        setInput(value);
                      }
                    }}
                    disabled={graceMessageUsed}
                    className="flex-1"
                    maxLength={280}
                  />
                  <PromptInputSubmit
                    status={status === "streaming" ? "streaming" : "ready"}
                    disabled={
                      !input.trim() ||
                      input.length > 280 ||
                      status === "submitted" ||
                      status === "streaming" ||
                      graceMessageUsed
                    }
                    className="mr-2"
                  />
                </div>
                <div className="px-3 pb-2 text-xs text-right text-gray-500">
                  {input.length}/280
                </div>
              </form>
              
              {/* Advertencia debajo del textarea - móvil */}
              <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
                <p className="text-xs text-amber-800 text-center">
                  Recuerda que solo es un asistente con <strong>inteligencia artificial</strong>, no reemplaza a un profesional ni a una persona física.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback card y Timer para móviles - debajo del chat */}
        <div className="pb-4 space-y-4">
          <SessionTimer
            createdAt={initialSessionData?.createdAt ? new Date(initialSessionData.createdAt) : null}
            maxDurationMs={initialSessionData?.maxDurationMs}
            groupEndDate={initialSessionData?.groupEndDate ? new Date(initialSessionData.groupEndDate) : null}
            isGroupSession={isGroupSession}
            messageCount={userMessageCount}
            onFinish={handleFinishChat}
            isFinishing={isFinishing}
            onExpire={handleTimerExpire}
          />
          <FeedbackCard 
            chatSessionId={sessionId} 
            isVisible={feedbackFormVisible}
            onHide={() => setFeedbackFormVisible(false)}
          />
        </div>
      </div>

      {/* Modal de advertencia (2 minutos antes) */}
      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>⌛Tiempo Casi Agotado</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
                <div className="text-sm">
                Quedan <strong>menos de 2 minutos</strong> de conversación. Veo que has usado casi todo tu tiempo. Considera contactarte con un profesional o persona física si necesitas más ayuda. <br />
                Al finalizar podrás completar un formulario para ayudar al equipo detrás de NoVa+ en su investigación, sería de mucha ayuda. <br />
                Si quieres contactarte con el equipo de NoVa+ visita{" "}
                <Link href="/quienesSomos" className="text-blue-600 underline">
                  quienes somos
                </Link>{" "}
                o puedes ver los contactos de emergencia en{" "}
                <Link href="/emergencia" className="text-blue-600 underline">
                  contactos de emergencia
                </Link>.
                </div>
            </div>
          </AlertDialogDescription>
          <AlertDialogAction onClick={() => setShowWarningDialog(false)}>
            Entendido
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de tiempo expirado (inicial) */}
      <AlertDialog open={showTimeoutDialog} onOpenChange={setShowTimeoutDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>⏰ Tiempo de Sesión Finalizado</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                Muchas gracias por usar NoVa+. Puedes leer el último mensaje de NoVa+ en el chat para saber cuales son tus opciones:
              </div>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>
                  <strong>Enviar un último mensaje</strong> si lo necesitas.
                </li>
                <li>
                  <strong>Finalizar tu sesión</strong> pulsando el botón rojo &quot;Finalizar Chat&quot;
                </li>
              </ul>
              <div className="text-xs text-amber-600 mt-2">
                ℹ️ Si usas el mensaje de gracia (1 mensaje más), la sesión se finalizará automáticamente 1 minuto después de este mensaje.
              </div>
            </div>
          </AlertDialogDescription>
          <AlertDialogAction onClick={() => setShowTimeoutDialog(false)}>
            Entendido
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default function NewChatInterface({
  chatSessionId,
  sessionData,
  isGroupSession,
  onFinish,
}: NewChatInterfaceProps) {
  return (
    <ConversationDemo 
      chatSessionId={chatSessionId}
      sessionData={sessionData}
      isGroupSession={isGroupSession}
      onFinish={onFinish}
    />
  );
}
