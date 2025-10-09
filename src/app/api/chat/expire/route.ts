import { NextResponse } from "next/server";
import { getChatSessionById, saveChat } from "@/lib/db";
import { CHAT_CONFIG } from "@/lib/chat-config";
import { MyUIMessage } from "@/types/types";

/**
 * API endpoint para marcar la sesión como expirada y añadir el mensaje de tiempo expirado
 * Se llama desde el frontend cuando el timer llega a 0
 */
export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Se requiere sessionId" },
        { status: 400 }
      );
    }

    // Obtener la sesión
    const chatSession = await getChatSessionById(sessionId);
    
    if (!chatSession.success || !chatSession.data) {
      return NextResponse.json(
        { error: "Sesión no encontrada" },
        { status: 404 }
      );
    }

    // Solo aplicar a sesiones individuales (sin chatGroupId)
    if (chatSession.data.chatGroupId) {
      return NextResponse.json(
        { success: true, message: "Sesión grupal, no se aplica expiración" }
      );
    }

    // Verificar si ya tiene el mensaje de expiración
    // Para evitar duplicados si el usuario recarga la página
    const { getChatMessagesAction } = await import("@/lib/actions/actions-chat");
    const messagesResult = await getChatMessagesAction(sessionId);
    
    if (messagesResult.success && messagesResult.data) {
      const messages = messagesResult.data as MyUIMessage[];
      const hasExpiredMessage = messages.some((msg) => 
        msg.role === "assistant" && 
        msg.parts.some(part => 
          part.type === "text" && 
          part.text.includes("El tiempo de la sesión ha finalizado")
        )
      );

      if (hasExpiredMessage) {
        return NextResponse.json({
          success: true,
          message: "El mensaje de expiración ya existe",
          alreadyExists: true
        });
      }
    }

    // Calcular minutos de duración
    const maxDurationMinutes = Math.floor(
      (chatSession.data.maxDurationMs || CHAT_CONFIG.MAX_DURATION_MS) / 60000
    );

    // Crear mensaje de tiempo expirado
    const expiredMessage: MyUIMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      parts: [{
        type: "text",
        text: CHAT_CONFIG.getTimeExpiredMessage(maxDurationMinutes)
      }],
      metadata: { createdAt: Date.now() }
    };

    // Guardar el mensaje
    await saveChat({
      chatSessionId: sessionId,
      messages: [expiredMessage],
    });

    console.log(`Mensaje de tiempo expirado añadido para sesión ${sessionId}`);

    return NextResponse.json({
      success: true,
      message: expiredMessage,
    });

  } catch (error) {
    console.error("Error en API chat/expire:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
