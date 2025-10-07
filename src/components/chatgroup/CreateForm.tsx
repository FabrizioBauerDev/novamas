"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"
import { createChatGroupAction } from "@/lib/actions/actions-chatgroup"
import type { CreateGroupFormData } from "@/types/types"

export default function CreateChatGroupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateGroupFormData>({
    name: "",
    slug: "",
    description: "",
    password: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  })

const handleInputChange = (field: keyof CreateGroupFormData, value: string) => {
    setFormData((prev) => ({
        ...prev,
        [field]: value,
    }))

    // Auto-generate slug from name
    if (field === "name") {
        const slug = value
            .toLowerCase()
            .normalize("NFD") // Normalize to decompose accents
            .replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[^a-z0-9\s]/g, "") // Remove non-alphanumeric characters
            .replace(/\s+/g, "") // Remove spaces
            .substring(0, 50)

        setFormData((prev) => ({
            ...prev,
            slug: slug,
        }))
    }
  }

  const validateForm = (): boolean => {
    const errors: string[] = []

    if (!formData.name.trim()) errors.push("El nombre del grupo es obligatorio")
    if (!formData.slug.trim()) errors.push("El slug es obligatorio")
    if (!formData.password.trim()) errors.push("La contraseña es obligatoria")
    if (!formData.startDate) errors.push("La fecha de inicio es obligatoria")
    if (!formData.startTime) errors.push("La hora de inicio es obligatoria")
    if (!formData.endDate) errors.push("La fecha de fin es obligatoria")
    if (!formData.endTime) errors.push("La hora de fin es obligatoria")

    // Validate dates
    if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)

      if (startDateTime >= endDateTime) {
        errors.push("La fecha de fin debe ser posterior a la fecha de inicio")
      }

      // Si es el mismo día, validar que haya al menos 30 minutos de diferencia
      if (formData.startDate === formData.endDate) {
        const timeDiffMs = endDateTime.getTime() - startDateTime.getTime()
        const timeDiffMinutes = timeDiffMs / (1000 * 60)
        
        if (timeDiffMinutes < 30) {
          errors.push("La sesión debe durar al menos 30 minutos")
        }
      }

      // Comparar con la fecha actual en la zona horaria local
      const now = new Date()
      if (startDateTime <= now) {
        errors.push("La fecha de inicio debe ser futura")
      }
    }

    if (formData.password.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres")
    }

    if (errors.length > 0) {
      toast.error("Errores en el formulario", {
        description: errors.join(". "),
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Crear fechas en la zona horaria local y convertir a UTC para enviar al servidor
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)

      // Preparar datos para enviar al backend con fechas ISO (UTC)
      const groupData: CreateGroupFormData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        password: formData.password,
        startDate: startDateTime.toISOString(),
        startTime: '', // Ya no necesitamos time separado
        endDate: endDateTime.toISOString(),
        endTime: '', // Ya no necesitamos time separado
      }

      // Llamar a la action
      const result = await createChatGroupAction(groupData)

      if (result.success) {
        toast.success("Grupo creado exitosamente", {
          description: `El grupo "${formData.name}" ha sido creado correctamente`,
        })
        // Redirigir a la visualización del grupo recién creado
        if (result?.data?.id) {
          router.push(`/chatgroup/${result.data.id}`)
        } else {
          toast.error("Error al redirigir", {
            description: "No se pudo obtener el ID del grupo creado.",
          })
          router.push(`/chatgroup`)
        }
      } else {
        toast.error("Error al crear el grupo", {
          description: result.error || "Ocurrió un error inesperado. Inténtalo nuevamente.",
        })
      }
    } catch (error) {
      console.error("Error creating group:", error)
      toast.error("Error al crear el grupo", {
        description: "Ocurrió un error inesperado. Inténtalo nuevamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const getCurrentTime = () => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/chatgroup" className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground text-center">Crear Nueva Sesión Grupal</h1>
          <p className="text-muted-foreground text-center mt-2">
            Completa la información para crear una nueva sesión grupal
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del grupo *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Escuela Mitre - 6to A"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/chat/</span>
                    <Input
                      id="slug"
                      placeholder="escuelamitre"
                      value={formData.slug}
                      onChange={(e) => handleInputChange("slug", e.target.value)}
                      maxLength={50}
                      pattern="[a-z0-9]+"
                      title="Solo letras minúsculas y números, sin espacios ni caracteres especiales"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Generación automática desde el nombre. Solo letras y números.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el propósito, objetivos o comentarios que creas importantes..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    maxLength={500}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">{formData.description.length}/500 caracteres</p>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña de acceso *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      minLength={8}
                      maxLength={50}
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Los participantes necesitarán esta contraseña para unirse al grupo
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Programación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Fecha de inicio *</Label>
                    <div className="relative">
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                        min={getTodayDate()}
                        className="pl-10"
                        required
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime">Hora de inicio *</Label>
                    <div className="relative">
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange("startTime", e.target.value)}
                        className="pl-10"
                        required
                      />
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha de fin *</Label>
                    <div className="relative">
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                        min={formData.startDate || getTodayDate()}
                        className="pl-10"
                        required
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">Hora de fin *</Label>
                    <div className="relative">
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange("endTime", e.target.value)}
                        className="pl-10"
                        required
                      />
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  El grupo estará disponible para chat durante este período de tiempo
                </p>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/chatgroup" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando grupo...
                  </>
                ) : (
                  "Crear grupo"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
