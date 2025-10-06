import type { UIMessage } from "ai";

// Función para crear el mensaje de bienvenida
export function createWelcomeMessage(): UIMessage {
  return {
    id: "",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "¡Hola! Soy NoVa+, tu asistente con inteligencia artificial para el juego responsable. ¿En qué puedo ayudarte?",
      },
    ],
    metadata: {
      createdAt: Date.now(),
    },
  };
}
