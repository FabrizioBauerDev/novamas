/**
 * Configuración global para las sesiones de chat
 * Centraliza todos los valores de tiempo y límites para fácil modificación
 */

export const CHAT_CONFIG = {
  /**
   * Duración máxima de una sesión de chat individual en milisegundos
   * Default: 3 minutos (180000 ms)
   * Solo aplica a chats sin chatGroupId
   */
  MAX_DURATION_MS: 3 * 60 * 1000, // 3 minutos

  /**
   * Umbral de advertencia antes de que expire la sesión
   * Default: 2 minutos antes (120000 ms)
   * Se mostrará un modal de advertencia
   */
  WARNING_THRESHOLD_MS: 2 * 60 * 1000, // 2 minutos

  /**
   * Número mínimo de mensajes del usuario antes de poder finalizar el chat manualmente
   * Default: 2 mensajes del usuario
   */
  MIN_MESSAGES_TO_FINISH: 2,

  /**
   * Tiempo de espera antes de redireccionar automáticamente al formulario
   * después de que expire la sesión
   * Default: 5 segundos (5000 ms)
   */
  AUTO_REDIRECT_DELAY_MS: 5000, // 5 segundos

  /**
   * Tiempo mínimo requerido para crear una sesión grupal
   * Default: 3 minutos (180000 ms)
   * No se permite crear sesiones si quedan menos de este tiempo hasta endDate
   */
  MIN_TIME_REQUIRED_MS: 3 * 60 * 1000, // 3 minutos

  /**
   * Mensaje inicial que el asistente enviará cuando el tiempo expire
   */
  getTimeExpiredMessage(maxDurationMinutes: number): string {
    return `⏰ **Lo siento... El tiempo de la sesión ha finalizado.**\n\n` +
           "Aún tienes **un mensaje** más para que puedas terminar de mejor manera nuestra conversación.\n\n" +
           "Puedes:\n\n" +
           "* Enviar un último mensaje si quieres.\n" +
           "* Finalizar tu sesión pulsando el botón rojo **\"Finalizar Chat\"**";
  },

  /**
   * Mensaje que el asistente enviará después de usar el mensaje de gracia
   */
  getGraceUsedMessage(): string {
    return `⏰ **Has utilizado tu mensaje de gracia.**\n\n` +
           "La sesión será finalizada automáticamente y serás redirigido a un formulario para ayudarnos en **1 minuto**, " +
           "o antes si pulsas el botón rojo **\"Finalizar Chat\"**.\n\n" +
           "¡Gracias por conversar conmigo! 💙";
  },
} as const;

/**
 * Formatea milisegundos a formato legible MM:SS
 * @param ms - Milisegundos a formatear
 * @returns String en formato "MM:SS"
 */
export function formatTimeRemaining(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calcula si una sesión ha expirado
 * @param createdAt - Fecha de creación de la sesión
 * @param maxDurationMs - Duración máxima en milisegundos
 * @returns true si la sesión ha expirado
 */
export function isSessionExpired(createdAt: Date, maxDurationMs: number): boolean {
  const sessionAge = Date.now() - createdAt.getTime();
  return sessionAge > maxDurationMs;
}

/**
 * Calcula el tiempo restante de una sesión
 * @param createdAt - Fecha de creación de la sesión
 * @param maxDurationMs - Duración máxima en milisegundos
 * @returns Milisegundos restantes (0 si ya expiró)
 */
export function getTimeRemaining(createdAt: Date, maxDurationMs: number): number {
  const sessionAge = Date.now() - createdAt.getTime();
  const remaining = maxDurationMs - sessionAge;
  return Math.max(0, remaining);
}
