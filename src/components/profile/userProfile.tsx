"use client"

import React, {useRef} from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { User, Mail, Calendar, Shield, CheckCircle2, Upload, Pencil, X } from "lucide-react"
import {getUserByIdAction, updateUserAction} from "@/lib/actions/actions-usermanagement";
import {UserData} from "@/types/types";


interface UserProfileProps {
    id: string;
}
export default function UserProfile({id}: UserProfileProps) {
    const { data: session, update: updateSession } = useSession()
    const [user, setUser] = useState<UserData | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedName, setEditedName] = useState("")
    const [editedImage, setEditedImage] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchProfile(id)
    }, [])

    const fetchProfile = async (id: string) => {
        try {
            const response = await getUserByIdAction(id);
            if (response.success) {
                const data = await response.data;
                if(data) {
                    setUser(data)
                    setEditedName(data.name)
                    setEditedImage(data.image || "")
                }else{
                    throw new Error();
                }
            }
        } catch (error) {
            toast.error("Error al obtener al usuario", {
                description: "Ocurrió un problema, intente nuevamente.",
                duration: 5000,
            });
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.error("Error al subir imagen", {
                description: "Tipo de imagen incompatible.",
                duration: 5000,
            });
            return
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Error al subir imagen", {
                description: "La imagen debe pesar menos de 2MB.",
                duration: 5000,
            });
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setEditedImage(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleSave = async () => {
        if (!user) return

        setIsUploading(true)
        try {
            const response = await updateUserAction({id: user.id, name: editedName, image: editedImage});

            if (response.success) {
                const updatedUser = await response.data;
                if(updatedUser) {
                    setUser(updatedUser)
                    setIsEditing(false)
                    toast.success("Perfil actualizado correctamente", {
                        duration: 5000,
                    });

                    // Actualizar la sesión con el nuevo nombre para reflejarlo en el navbar
                    if (session?.user) {
                        await updateSession({
                            ...session,
                            user: {
                                ...session.user,
                                name: updatedUser.name,
                                image: updatedUser.image,
                            },
                        })
                    }
                }else{
                    toast.error("Error al actualizar al usuario", {
                        duration: 5000,
                    });
                }
            }
        } catch (error) {
            toast.error("Error al actualizar al usuario", {
                duration: 5000,
            });
        } finally {
            setIsUploading(false)
            setIsEditing(false)
        }
    }

    const handleCancel = () => {
        if (user) {
            setEditedName(user.name)
            setEditedImage(user.image || "")
        }
        setIsEditing(false)
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "ADMINISTRADOR":
                return "bg-red-500/10 text-red-500 border-red-500/20"
            case "INVESTIGADOR":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20"
            case "ESTUDIANTE":
                return "bg-green-500/10 text-green-500 border-green-500/20"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const getStatusBadgeColor = (status: string) => {
        return status === "ACTIVO"
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            : "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const formatDate = (dateString: Date) => {
        return dateString.getDate() + " de " + dateString.toLocaleString("es-ES", { month: "long" }) + " de " + dateString.getFullYear()
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-balance">Mi Perfil</h1>
                        <p className="text-muted-foreground mt-1">Gestiona tu información personal</p>
                    </div>
                    {!isEditing && (
                        <Button onClick={() => setIsEditing(true)} size="lg">
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar Perfil
                        </Button>
                    )}
                </div>

                {/* Profile Card */}
                <Card className="p-8 border-border/50 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative group">
                                <Avatar className="w-32 h-32 border-4 border-border shadow-xl">
                                    <AvatarImage src={(isEditing ? editedImage : user.image) || undefined} alt={user.name} />
                                    <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-primary/20 to-primary/5">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                {isEditing && (
                                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Subir Imagen
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Badge className={getRoleBadgeColor(user.role)} variant="outline">
                                    <Shield className="w-3 h-3 mr-1" />
                                    {user.role}
                                </Badge>
                                <Badge className={getStatusBadgeColor(user.status)} variant="outline">
                                    {user.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 space-y-6">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Nombre Completo
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="name"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="text-lg"
                                        placeholder="Ingresa tu nombre"
                                    />
                                ) : (
                                    <p className="text-lg font-medium">{user.name}</p>
                                )}
                            </div>

                            {/* Email Field (Read-only) */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Correo Electrónico
                                </Label>
                                <div className="flex items-center gap-2">
                                    <p className="text-lg text-muted-foreground">{user.email}</p>
                                </div>
                            </div>

                            {/* Role Field (Read-only) */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Rol
                                </Label>
                                <p className="text-lg text-muted-foreground">{user.role}</p>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Miembro desde
                                    </Label>
                                    <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Última actualización
                                    </Label>
                                    <p className="text-sm font-medium">{formatDate(user.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border/50">
                            <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
                                <X className="w-4 h-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button onClick={handleSave} disabled={isUploading}>
                                {isUploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Guardar Cambios
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
