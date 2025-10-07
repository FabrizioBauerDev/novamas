"use client";

import { Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { cn } from "@/lib/utils";

interface SessionTimerProps {
  /**
   * Fecha de creación de la sesión
   */
  createdAt: Date | null;
  
  /**
   * Duración máxima en milisegundos
   */
  maxDurationMs?: number;
  
  /**
   * Si es una sesión grupal (no muestra timer)
   */
  isGroupSession?: boolean;
  
  /**
   * Número de mensajes actuales (para habilitar botón)
   */
  messageCount: number;
  
  /**
   * Callback al presionar finalizar
   */
  onFinish: () => void;
  
  /**
   * Si está en proceso de finalización
   */
  isFinishing?: boolean;
}

export function SessionTimer({
  createdAt,
  maxDurationMs,
  isGroupSession = false,
  messageCount,
  onFinish,
  isFinishing = false,
}: SessionTimerProps) {
  const {
    formattedTime,
    isExpired,
    isCritical,
    isDanger,
  } = useSessionTimer({
    createdAt,
    maxDurationMs,
    disabled: isGroupSession,
  });

  // No mostrar nada para sesiones grupales
  if (isGroupSession) {
    return null;
  }

  // Determinar si el botón debe estar habilitado
  // Requiere al menos 5 mensajes (incluye mensaje de bienvenida)
  const minMessages = 5;
  const canFinish = messageCount >= minMessages;
  const messagesNeeded = Math.max(0, minMessages - messageCount);

  // Calcular minutos restantes (usando techo para redondear hacia arriba)
  const getMinutesRemaining = () => {
    if (isExpired) return 0;
    
    // Extraer minutos y segundos del formattedTime (formato "MM:SS")
    const [minutes, seconds] = formattedTime.split(':').map(Number);
    
    // Si hay segundos, redondear hacia arriba
    if (seconds > 0) {
      return minutes + 1;
    }
    
    // Si es exactamente X:00, usar ese valor pero mínimo 1
    return Math.max(minutes, 1);
  };

  const minutesRemaining = getMinutesRemaining();

  return (
    <Card className="w-full border-gray-200 py-2">
      <CardContent className="p-2 space-y-1">
        <div className="flex flex-col items-center gap-1">
          <p
            className={cn(
              "text-sm font-normal text-center flex items-center gap-2",
              isExpired ? "text-gray-400" :
              isDanger ? "text-red-600" :
              isCritical ? "text-amber-600" :
              "text-gray-800"
            )}
          >
            <Clock 
              className={cn(
                "w-5 h-5",
                isDanger ? "text-red-500" : 
                isCritical ? "text-amber-500" : 
                "text-gray-600"
              )} 
            />
            {isExpired 
              ? "Sesión finalizada" 
              : `Tiempo de sesión restante: ${minutesRemaining} minuto${minutesRemaining !== 1 ? 's' : ''}`
            }
          </p>
          
          {isDanger && !isExpired && (
            <p className="text-xs text-red-600 text-center font-medium">
              ⚠️ Tiempo casi agotado
            </p>
          )}
        </div>

        {/* Separador */}
        <div className="border-t border-gray-200" />

        {/* Botón Finalizar */}
        <div className="space-y-2">
          <Button
            onClick={onFinish}
            disabled={!canFinish || isFinishing}
            variant={canFinish ? "destructive" : "outline"}
            className="w-full"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isFinishing
              ? "Finalizando..."
              : canFinish
              ? "Finalizar Chat"
              : `Faltan ${messagesNeeded} mensaje${messagesNeeded !== 1 ? "s" : ""}`}
          </Button>
          
          {!canFinish && (
            <p className="text-xs text-gray-500 text-center">
              Envía al menos {minMessages} mensajes para finalizar
            </p>
          )}
          
          {canFinish && !isExpired && (
            <p className="text-xs text-gray-600 text-center">
              Finaliza el chat cuando quieras.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
