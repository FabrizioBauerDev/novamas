import type { UIMessage } from "ai";

// Función para crear el mensaje de bienvenida
export function createWelcomeMessage(): UIMessage {
  return {
    id: "",
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
  };
}
