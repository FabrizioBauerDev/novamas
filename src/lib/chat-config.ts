/**
 * Configuración global para las sesiones de chat
 * Centraliza todos los valores de tiempo y límites para fácil modificación
 */

export const CHAT_CONFIG = {
  /**
   * Duración máxima de una sesión de chat individual en milisegundos
   * Default: 5 minutos (300000 ms)
   * Solo aplica a chats sin chatGroupId
   */
  MAX_DURATION_MS: 5 * 60 * 1000, // 5 minutos

  /**
   * Umbral de advertencia antes de que expire la sesión
   * Default: 2 minutos antes (120000 ms)
   * Se mostrará un modal de advertencia
   */
  WARNING_THRESHOLD_MS: 2 * 60 * 1000, // 2 minutos

  /**
   * Número mínimo de mensajes antes de poder finalizar el chat manualmente
   * Default: 5 mensajes (incluye mensaje de bienvenida)
   */
  MIN_MESSAGES_TO_FINISH: 5,

  /**
   * Tiempo de espera antes de redireccionar automáticamente al formulario
   * después de que expire la sesión
   * Default: 5 segundos (5000 ms)
   */
  AUTO_REDIRECT_DELAY_MS: 5000, // 5 segundos

  /**
   * Mensaje que el asistente enviará automáticamente cuando se use el mensaje de gracia
   * Nota: El tiempo se reemplazará dinámicamente con el valor real de maxDurationMs
   */
  getGraceMessage(maxDurationMinutes: number): string {
    return `⏰ **Tu sesión ha alcanzado el tiempo máximo de ${maxDurationMinutes} minutos.**\n\n` +
           "Este ha sido mi último mensaje. La conversación finalizará en breve.\n\n" +
           "Serás redirigido al formulario de evaluación para completar tu experiencia. " +
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
