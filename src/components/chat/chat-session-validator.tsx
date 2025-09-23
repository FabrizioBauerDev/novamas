"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Clock, XCircle } from "lucide-react";
import { getChatGroupBySlugAction, verifyChatGroupPasswordAction } from "@/lib/actions/actions-chatgroup";
import ChatDemoContainer from '@/components/chat/chat-demo-container';

interface ChatGroup {
  id: string;
  creatorId: string;
  name: string;
  slug: string;
  description: string | null;
  password: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  creatorName: string | null;
}

interface ChatSessionValidatorProps {
  slug: string;
}

export default function ChatSessionValidator({ slug }: ChatSessionValidatorProps) {
  const router = useRouter();
  const [chatGroup, setChatGroup] = useState<ChatGroup | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<string>("");
  const [minutesRemaining, setMinutesRemaining] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Efecto para actualizar el tiempo restante cuando la sesión está próxima
  useEffect(() => {
    if (sessionStatus === "PENDIENTE_PROXIMA" && chatGroup) {
      const interval = setInterval(() => {
        const now = new Date();
        const startDate = new Date(chatGroup.startDate);
        const timeDiff = startDate.getTime() - now.getTime();
        const minutes = Math.ceil(timeDiff / (1000 * 60));
        
        if (minutes <= 0) {
          // La sesión ya está activa, recargar para mostrar el formulario de contraseña
          window.location.reload();
        } else if (minutes !== minutesRemaining) {
          setMinutesRemaining(minutes);
        }
      }, 10000); // Verificar cada 10 segundos

      return () => clearInterval(interval);
    }
  }, [sessionStatus, chatGroup, minutesRemaining]);

  useEffect(() => {
    const validateSession = async () => {
      setIsLoading(true);
      setError("");

      try {
        const result = await getChatGroupBySlugAction(slug);
        
        if (!result.success) {
          if (result.status === "FINALIZADA" || result.status === "PENDIENTE_LEJANA") {
            setError(result.error || "");
            setSessionStatus(result.status);
          } else {
            setError(result.error || "Sesión no encontrada");
            // Redirigir después de 3 segundos
            setTimeout(() => {
              router.push("/");
            }, 3000);
          }
        } else if (result.data) {
          setChatGroup(result.data);
          setSessionStatus(result.status || "");
          if (result.minutesRemaining) {
            setMinutesRemaining(result.minutesRemaining);
          }
        }
      } catch (error) {
        console.error("Error validating session:", error);
        setError("Error al verificar la sesión");
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [slug, router]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingPassword(true);
    setError("");

    try {
      const result = await verifyChatGroupPasswordAction(slug, password);
      
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        setError(result.error || "Error al verificar la contraseña");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setError("Error al verificar la contraseña");
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  // Si está autenticado, mostrar el chat
  if (isAuthenticated && chatGroup) {
    return <ChatDemoContainer slug={slug} />;
  }

  // Pantalla de carga
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-b-blue-900 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Validando sesión...
          </h1>
          <p className="text-muted-foreground">Verificando disponibilidad de la sesión grupal</p>
        </div>
      </div>
    );
  }

  // Pantalla de error para sesión finalizada o pendiente lejana
  if (sessionStatus === "FINALIZADA" || sessionStatus === "PENDIENTE_LEJANA") {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg border-2 border-red-200">
          <div className="mb-4">
            {sessionStatus === "FINALIZADA" ? (
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            ) : (
              <Clock className="h-16 w-16 text-yellow-500 mx-auto" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {sessionStatus === "FINALIZADA" ? "Sesión Finalizada" : "Sesión Aún No Disponible"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {error}
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

  // Pantalla de espera para sesión próxima (sin formulario de contraseña)
  if (sessionStatus === "PENDIENTE_PROXIMA" && chatGroup) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg border-2 border-blue-200">
          <div className="mb-4">
            <Clock className="h-16 w-16 text-blue-500 mx-auto animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {chatGroup.name}
          </h1>
          <p className="text-muted-foreground mb-4">
            La sesión comenzará en:
          </p>
          <div className="text-3xl font-bold text-blue-600 mb-6">
            {minutesRemaining} minuto{minutesRemaining !== 1 ? 's' : ''}
          </div>
          <div className="text-sm text-muted-foreground mb-6">
            <p>Horario de la sesión:</p>
            <p className="font-medium text-blue-600">
              {new Date(chatGroup.startDate).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" - "}
              {new Date(chatGroup.endDate).toLocaleDateString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            La página se actualizará automáticamente cuando la sesión esté disponible
          </p>
        </div>
      </div>
    );
  }

  // Si no hay chatGroup pero no hay error de sesión (error de conexión, etc.)
  if (!chatGroup && error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg border-2 border-red-200">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Error
          </h1>
          <p className="text-muted-foreground mb-6">
            {error}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Serás redirigido automáticamente...
          </p>
        </div>
      </div>
    );
  }

  // Dialog de contraseña (solo para sesiones activas)
  if (sessionStatus === "ACTIVA" && chatGroup) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col">
        <Dialog open={true} modal>
          <DialogContent
            className="sm:max-w-md border-border border-2 bg-card"
            showCloseButton={false}
          >
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
                <AlertCircle className="h-6 w-6" />
                {chatGroup.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-base font-medium">
                Ingrese la contraseña para acceder a la sesión grupal
              </DialogDescription>
            </DialogHeader>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese la contraseña del grupo"
                  className="pr-10 border-input focus:border-ring focus:ring-ring"
                  required
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-destructive text-sm font-medium bg-destructive/10 p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
              disabled={isVerifyingPassword || !password.trim()}
            >
              {isVerifyingPassword ? "Verificando..." : "Acceder al Chat"}
            </Button>
          </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>Esta sesión está activa desde:</p>
              <p className="font-medium text-red-600 dark:text-red-400">
                {new Date(chatGroup.startDate).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>hasta:</p>
              <p className="font-medium text-red-600 dark:text-red-400">
                {new Date(chatGroup.endDate).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Fallback - no debería llegar aquí en condiciones normales
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Estado desconocido
        </h1>
        <p className="text-muted-foreground mb-4">
          No se pudo determinar el estado de la sesión
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
}