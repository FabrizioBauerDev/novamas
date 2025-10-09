import { useState, useEffect, useCallback } from "react";
import { CHAT_CONFIG, getTimeRemaining, formatTimeRemaining } from "@/lib/chat-config";

export interface UseSessionTimerProps {
  /**
   * Fecha de creación de la sesión de chat
   */
  createdAt: Date | null;
  
  /**
   * Duración máxima de la sesión en milisegundos (para sesiones individuales)
   * Default: CHAT_CONFIG.MAX_DURATION_MS (3 minutos)
   */
  maxDurationMs?: number;
  
  /**
   * Fecha de finalización del grupo (para sesiones grupales)
   */
  groupEndDate?: Date | null;
  
  /**
   * Si es una sesión grupal
   */
  isGroupSession?: boolean;

  /**
   * Callback que se ejecuta cuando el timer expira (llega a 0)
   */
  onExpire?: () => void;
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
 * Soporta tanto sesiones individuales como grupales
 */
export function useSessionTimer({
  createdAt,
  maxDurationMs = CHAT_CONFIG.MAX_DURATION_MS,
  groupEndDate,
  isGroupSession = false,
  onExpire,
}: UseSessionTimerProps): UseSessionTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState<number>(maxDurationMs);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [hasCalledOnExpire, setHasCalledOnExpire] = useState<boolean>(false);

  const updateTimer = useCallback(() => {
    if (!createdAt) {
      setTimeRemaining(maxDurationMs);
      setIsExpired(false);
      return;
    }

    let remaining: number;
    
    if (isGroupSession && groupEndDate) {
      // Para sesiones grupales, calcular tiempo restante hasta endDate
      remaining = Math.max(0, groupEndDate.getTime() - Date.now());
    } else {
      // Para sesiones individuales, usar maxDurationMs desde createdAt
      remaining = getTimeRemaining(createdAt, maxDurationMs);
    }
    
    const expired = remaining === 0;
    
    setTimeRemaining(remaining);
    setIsExpired(expired);

    // Llamar a onExpire solo una vez cuando expire
    if (expired && !hasCalledOnExpire && onExpire) {
      setHasCalledOnExpire(true);
      onExpire();
    }
  }, [createdAt, maxDurationMs, groupEndDate, isGroupSession, hasCalledOnExpire, onExpire]);

  // Actualizar el timer cada segundo
  useEffect(() => {
    // Actualizar inmediatamente
    updateTimer();

    // Configurar intervalo
    const intervalId = setInterval(updateTimer, 1000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId);
  }, [updateTimer]);

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
