"use client";

import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChatGroupWithCreator } from "@/types/types";

interface ChatGroupCardProps {
  group: ChatGroupWithCreator;
  onView: (group: ChatGroupWithCreator) => void;
  onDelete: (group: ChatGroupWithCreator) => void;
  isStudent?: boolean;
}

export default function ChatGroupCard({
  group,
  onView,
  onDelete,
  isStudent = false,
}: ChatGroupCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow border-2 py-2">
      <CardContent className="p-2 mx-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Group Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-xl font-semibold text-foreground">
                {group.name}
              </h3>
              <span className="text-sm text-muted-foreground">
                por {group.creatorName}
              </span>
              {new Date() >= group.startDate && new Date() <= group.endDate && (
                <span className="inline-block rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white w-fit">
                  ACTIVO
                </span>
              )}
              {new Date() > group.endDate && (
                <span className="inline-block rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white w-fit">
                  FINALIZADO
                </span>
              )}
              {new Date() < group.startDate && (
                <span className="inline-block rounded-full bg-gray-500 px-2 py-1 text-xs font-semibold text-white w-fit">
                  PENDIENTE
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Inicio:</span>{" "}
                <span>
                  {group.startDate.toLocaleString("es-AR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "America/Argentina/Buenos_Aires"
                  })}
                </span>
              </div>
              <div>
                <span className="font-medium">Fin:</span>{" "}
                <span>
                  {group.endDate.toLocaleString("es-AR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "America/Argentina/Buenos_Aires"
                  })}
                </span>
              </div>
            </div>

            {group.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {group.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => onView(group)}
            >
              <Eye className="h-4 w-4" />
              Ver
            </Button>
            {!isStudent && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-destructive hover:text-white hover:bg-destructive bg-transparent"
                onClick={() => onDelete(group)}
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
