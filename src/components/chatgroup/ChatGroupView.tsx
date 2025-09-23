"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getChatGroupByIdAction,
  decryptChatGroupPasswordAction,
} from "@/lib/actions/actions-chatgroup";
import { ChatGroupWithCreator } from "@/types/types";
import QrGenerator from "@/components/shared/QrGenerator";
import Link from "next/link";
import { toast } from "sonner";

interface ChatGroupDetailPageProps {
  id: string;
}

export default function ChatGroupDetailPage({ id }: ChatGroupDetailPageProps) {
  const router = useRouter();
  const [group, setGroup] = useState<ChatGroupWithCreator | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(
    null
  );
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const groupUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/chatNova/${group?.slug}`;

  useEffect(() => {
    const loadGroup = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getChatGroupByIdAction(id);
        if (result.success && result.data) {
          setGroup(result.data);
        } else {
          setError(result.error || "Grupo no encontrado");
        }
      } catch (err) {
        setError("Error al cargar el grupo");
        console.error("Error loading group:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadGroup();
    }
  }, [id]);

  const handleShare = () => {
    // TODO: Implementar funcionalidad de compartir
    console.log("Compartir grupo:", group?.name);
  };

  const handleTogglePassword = async () => {
    if (!showPassword && !decryptedPassword && group) {
      // Primera vez que se muestra la contraseña, desencriptarla
      setIsDecrypting(true);
      try {
        const result = await decryptChatGroupPasswordAction(group.id);
        if (result.success && result.password) {
          setDecryptedPassword(result.password);
          setShowPassword(true);
        } else {
          toast.error("Error al mostrar contraseña", {
            description:
              result.error || "No se pudo desencriptar la contraseña",
          });
        }
      } catch (error) {
        console.error("Error al desencriptar contraseña:", error);
        toast.error("Error inesperado", {
          description: "Ocurrió un error al intentar mostrar la contraseña",
        });
      } finally {
        setIsDecrypting(false);
      }
    } else {
      // Solo alternar la visibilidad
      setShowPassword(!showPassword);
    }
  };

  // Obtener participantes del grupo
  const participants = group?.participants || [];

  // SKELETON PARA LA CARGA
  if (loading) {
    return (
      <div className="bg-background">
        {/* Header Skeleton */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-9 w-20 bg-muted rounded-md animate-pulse"></div>
            </div>
            <div className="text-center">
              <div className="h-10 w-64 bg-muted rounded-md animate-pulse mx-auto"></div>
            </div>
          </div>
        </header>

        {/* Main Content Skeleton */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Description and QR Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <div className="h-6 w-20 bg-muted rounded animate-pulse mx-auto"></div>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="w-48 h-48 bg-muted rounded-lg animate-pulse"></div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Access Information Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="h-6 w-28 bg-muted rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <div className="h-10 flex-1 bg-muted rounded animate-pulse"></div>
                    <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dates Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="h-6 w-28 bg-muted rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-6 w-40 bg-muted rounded animate-pulse"></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-6 w-40 bg-muted rounded animate-pulse"></div>
                </CardContent>
              </Card>
            </div>

            {/* Creator Information Skeleton */}
            <Card>
              <CardHeader>
                <div className="h-6 w-40 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="h-6 w-32 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 w-16 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                      <div>
                        <div className="h-4 w-20 bg-muted rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Grupo no encontrado
          </h2>
          <p className="text-muted-foreground mb-4">
            {error || "El grupo que buscas no existe o ha sido eliminado."}
          </p>
          <Link href="/chatgroup">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/chatgroup")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-foreground text-center flex items-center justify-center gap-2">
            {group.name}
            {new Date() >= group.startDate && new Date() <= group.endDate && (
              <span className="inline-block rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                ACTIVO
              </span>
            )}
            {new Date() > group.endDate && (
              <span className="inline-block rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                FINALIZADO
              </span>
            )}
            {new Date() < group.startDate && (
              <span className="inline-block rounded-full bg-gray-500 px-2 py-1 text-xs font-semibold text-white">
                PENDIENTE
              </span>
            )}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Description and QR Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Description */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {group.description || "Sin descripción disponible"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* QR Code */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Código QR</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <QrGenerator
                    url={groupUrl}
                    size={192}
                    className="w-48 h-48"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Access Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <Card>
              <CardHeader>
                <CardTitle>Contraseña de acceso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={
                        showPassword && decryptedPassword
                          ? decryptedPassword
                          : "••••••••"
                      }
                      readOnly
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={handleTogglePassword}
                      disabled={isDecrypting}
                    >
                      {isDecrypting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      ) : showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Link and Share */}
            <Card>
              <CardHeader>
                <CardTitle>Enlace del grupo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input value={groupUrl} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Share2 className="h-4 w-4" />
                    Compartir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fecha de inicio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  {group.startDate.toLocaleString("es-AR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "America/Argentina/Buenos_Aires",
                  })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fecha de fin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  {group.endDate.toLocaleString("es-AR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "America/Argentina/Buenos_Aires",
                  })}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Creator Information and Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Creator Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información del creador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-medium">{group.creatorName}</p>
                    <p className="text-sm text-muted-foreground">
                      Creador del grupo
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Creado el</p>
                    <p className="font-medium">
                      {group.createdAt.toLocaleString("es-AR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: "America/Argentina/Buenos_Aires",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants del relevamiento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Participantes del relevamiento
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                    {participants.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {participants.length > 0 ? (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-2"
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {participant.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">
                            {participant.name || "Sin nombre"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Añadido/a el:{" "}
                            {participant.joinedAt.toLocaleDateString("es-AR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                              timeZone: "America/Argentina/Buenos_Aires",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No hay participantes en el relevamiento de este grupo.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
