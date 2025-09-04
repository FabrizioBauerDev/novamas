"use client"

import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onCreateNew: () => void
}

export default function SearchBar({ searchTerm, onSearchChange, onCreateNew }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar sesiones grupales..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button 
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={onCreateNew}
      >
        <Plus className="h-4 w-4 mr-2" />
        Crear nuevo grupo
      </Button>
    </div>
  )
}
