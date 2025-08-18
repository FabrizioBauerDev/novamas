"use client"

import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  hasSearchTerm: boolean
  searchTerm?: string
}

export default function EmptyState({ hasSearchTerm, searchTerm }: EmptyStateProps) {
  return (
    <Card className="border-2">
      <CardContent className="p-8 text-center">
        <p>
          {hasSearchTerm
            ? "No se encontraron sesiones grupales que coincidan con tu búsqueda."
            : "No hay sesiones grupales creadas aún."}
        </p>
      </CardContent>
    </Card>
  )
}
