"use client";

import { useState, useEffect } from "react";
import { Search, Plus, X, User, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  searchUsersForGroupAction,
  addParticipantToGroupAction,
  removeParticipantFromGroupAction,
} from "@/lib/actions/actions-chatgroup-members";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface Participant {
  id: string;
  name: string | null;
  email: string;
  role: string;
  joinedAt: Date;
}

interface ParticipantManagerProps {
  chatGroupId: string;
  participants: Participant[];
  creatorId: string;
  currentUserId?: string;
  onParticipantsChange: () => void;
  isStudent?: boolean;
}

export default function ParticipantManager({
  chatGroupId,
  participants,
  creatorId,
  currentUserId,
  onParticipantsChange,
  isStudent = false,
}: ParticipantManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | Participant | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Función para buscar usuarios
  const searchUsers = async (term: string) => {
    if (term.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchUsersForGroupAction(chatGroupId, term);
      if (result.success && result.data) {
        setSearchResults(result.data);
      } else {
        setSearchResults([]);
        if (result.error) {
          toast.error("Error", { description: result.error });
        }
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
      toast.error("Error", { description: "Error al buscar usuarios" });
    } finally {
      setIsSearching(false);
    }
  };

  // Efecto para buscar usuarios cuando cambia el término de búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, chatGroupId]);

  // Función para añadir participante
  const handleAddParticipant = async (user: User) => {
    setIsLoading(true);
    try {
      const result = await addParticipantToGroupAction(chatGroupId, user.id);
      if (result.success) {
        toast.success("Éxito", { description: result.message });
        setAddDialogOpen(false);
        setSearchTerm("");
        setSearchResults([]);
        onParticipantsChange();
      } else {
        toast.error("Error", { description: result.error });
      }
    } catch (error) {
      console.error("Error adding participant:", error);
      toast.error("Error", { description: "Error al añadir el participante" });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para eliminar participante
  const handleRemoveParticipant = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      const result = await removeParticipantFromGroupAction(chatGroupId, selectedUser.id);
      if (result.success) {
        toast.success("Éxito", { description: result.message });
        setRemoveDialogOpen(false);
        setSelectedUser(null);
        onParticipantsChange();
      } else {
        toast.error("Error", { description: result.error });
      }
    } catch (error) {
      console.error("Error removing participant:", error);
      toast.error("Error", { description: "Error al eliminar el participante" });
    } finally {
      setIsLoading(false);
    }
  };

  // Determinar si el usuario actual es el creador
  const isCreator = currentUserId === creatorId;
  
  // Función para determinar si se puede eliminar un participante
  const canRemoveParticipant = (participantId: string) => {
    if (isStudent) return false; // Los estudiantes no pueden eliminar
    if (isCreator) return true; // El creador puede eliminar a cualquiera
    return participantId !== creatorId; // Otros roles no pueden eliminar al creador
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isStudent ? "Participantes" : "Gestión de Participantes"}
            <span className="text-sm bg-gray-100 px-2 py-1 rounded-md text-gray-600">
              {participants.length}
            </span>
          </CardTitle>

          {/* Botón para añadir participante - Solo para no estudiantes */}
          {!isStudent && (
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Añadir participante
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Añadir participante</DialogTitle>
                <DialogDescription>
                  Busca y selecciona un usuario para añadir al grupo.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Buscador */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Resultados de búsqueda */}
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {isSearching ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {user.name?.charAt(0).toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name || "Sin nombre"}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-blue-600">{user.role}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddParticipant(user)}
                          disabled={isLoading}
                        >
                          {isLoading ? "Añadiendo..." : "Añadir"}
                        </Button>
                      </div>
                    ))
                  ) : searchTerm.length >= 2 ? (
                    <p className="text-center py-4 text-muted-foreground">
                      No se encontraron usuarios
                    </p>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      Escribe al menos 2 caracteres para buscar
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {participants.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {participant.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{participant.name || "Sin nombre"}</p>
                    <p className="text-xs text-muted-foreground">{participant.email}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-blue-600">{participant.role}</p>
                      {participant.id === creatorId && (
                        <span className="inline-block rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-semibold">
                          CREADOR
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Añadido: {participant.joinedAt.toLocaleDateString("es-AR")}
                    </p>
                  </div>
                </div>
                
                {/* Mostrar botón de eliminar según permisos */}
                {canRemoveParticipant(participant.id) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(participant);
                      setRemoveDialogOpen(true);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-4">
            No hay participantes en este grupo.
          </p>
        )}
      </CardContent>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar participante?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar a{" "}
              <strong>{selectedUser?.name || "este usuario"}</strong> del grupo?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveParticipant}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}