import { useState, useEffect, useCallback } from "react";
import { CHAT_CONFIG, getTimeRemaining, formatTimeRemaining } from "@/lib/chat-config";

export interface UseSessionTimerProps {
  /**
   * Fecha de creación de la sesión de chat
   */
  createdAt: Date | null;
  
  /**
   * Duración máxima de la sesión en milisegundos
   * Default: CHAT_CONFIG.MAX_DURATION_MS (20 minutos)
   */
  maxDurationMs?: number;
  
  /**
   * Si es true, el timer no se ejecutará (para sesiones grupales)
   */
  disabled?: boolean;
}

export interface UseSessionTimerReturn {
  /**
   * Tiempo restante en milisegundos
   */
  timeRemaining: number;
  
  /**
   * Tiempo restante formateado como "MM:SS"
   */
  formattedTime: string;
  
  /**
   * Si la sesión ha expirado (>= maxDurationMs)
   */
  isExpired: boolean;
  
  /**
   * Si quedan menos de 2 minutos (mostrar advertencia)
   */
  showWarning: boolean;
  
  /**
   * Si quedan menos de 5 minutos (cambiar color a amarillo)
   */
  isCritical: boolean;
  
  /**
   * Si quedan menos de 2 minutos (cambiar color a rojo)
   */
  isDanger: boolean;
}

/**
 * Hook personalizado para gestionar el timer de sesión de chat
 * Actualiza cada segundo y proporciona estados visuales
 */
export function useSessionTimer({
  createdAt,
  maxDurationMs = CHAT_CONFIG.MAX_DURATION_MS,
  disabled = false,
}: UseSessionTimerProps): UseSessionTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState<number>(maxDurationMs);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const updateTimer = useCallback(() => {
    if (!createdAt || disabled) {
      setTimeRemaining(maxDurationMs);
      setIsExpired(false);
      return;
    }

    const remaining = getTimeRemaining(createdAt, maxDurationMs);
    setTimeRemaining(remaining);
    setIsExpired(remaining === 0);
  }, [createdAt, maxDurationMs, disabled]);

  // Actualizar el timer cada segundo
  useEffect(() => {
    if (disabled) return;

    // Actualizar inmediatamente
    updateTimer();

    // Configurar intervalo
    const intervalId = setInterval(updateTimer, 1000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId);
  }, [updateTimer, disabled]);

  // Calcular estados de advertencia
  const showWarning = timeRemaining > 0 && timeRemaining <= CHAT_CONFIG.WARNING_THRESHOLD_MS;
  const isCritical = timeRemaining > 0 && timeRemaining <= 5 * 60 * 1000; // 5 minutos
  const isDanger = timeRemaining > 0 && timeRemaining <= CHAT_CONFIG.WARNING_THRESHOLD_MS; // 2 minutos

  return {
    timeRemaining,
    formattedTime: formatTimeRemaining(timeRemaining),
    isExpired,
    showWarning,
    isCritical,
    isDanger,
  };
}
