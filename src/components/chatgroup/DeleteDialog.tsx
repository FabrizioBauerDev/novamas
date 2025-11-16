"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChatGroupWithCreator } from "@/types/types"

interface DeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  groupToDelete: ChatGroupWithCreator | null
  onConfirm: () => void
  error?: string | null
}

export default function DeleteDialog({ isOpen, onOpenChange, groupToDelete, onConfirm, error }: DeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogDescription>
            {error ? (
              <span className="text-destructive font-medium">{error}</span>
            ) : (
              <>
                ¿Estás seguro de que deseas eliminar la sesión grupal &quot;{groupToDelete?.name}&quot;? Esta acción no se puede
                deshacer.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {error ? "Cerrar" : "Cancelar"}
          </Button>
          {!error && (
            <Button variant="destructive" onClick={onConfirm}>
              Eliminar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
