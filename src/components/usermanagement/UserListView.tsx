"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {Plus, Pencil, Trash2, Search, Users, Loader2, EyeOff, Eye} from "lucide-react"
import {getUsersAction} from "@/lib/actions/actions-usermanagement";
import {UserData} from "@/types/types";
import {toast} from "sonner";

interface UserManagementProps {
    userEmail: string | null | undefined
}

type UserFormData = {
    id?: string
    name: string
    email: string
    password?: string
    role: "ADMINISTRADOR" | "INVESTIGADOR" | "ESTUDIANTE"
    status?: "ACTIVO" | "DESACTIVADO"
}

export function UserManagement({userEmail}: UserManagementProps) {
    const [users, setUsers] = useState<UserData[]|undefined>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<UserData | null>(null)
    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        email: "",
        password: "",
        role: "ESTUDIANTE",
    })
    const [showPassword, setShowPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState<string[]>([])
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [filterStatus, setFilterStatus] = useState("Todos los estados")

    useEffect(() => {
        fetchUsers()
    }, [])

    const validatePasswordSecurity = (password: string): string[] => {
        const errors: string[] = []

        if (password.length < 12) {
            errors.push("Debe tener al menos 12 caracteres")
        }

        if (!/[A-Z]/.test(password)) {
            errors.push("Debe contener al menos una mayúscula")
        }

        if (!/[a-z]/.test(password)) {
            errors.push("Debe contener al menos una minúscula")
        }

        if (!/\d/.test(password)) {
            errors.push("Debe contener al menos un número")
        }

        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push("Debe contener al menos un carácter especial")
        }

        return errors
    }

    const fetchUsers = async () => {
        try {
            const result = await getUsersAction();
            if(result.success){
                setUsers(result.data)
            }else{
                toast.error("Error al cargar los usuarios.", {
                    description: "Error de conexión",
                    duration: 5000,
                });
            }
        } catch (error) {
            toast.error("Error al cargar los usuarios.", {
                description: "Error de conexión",
                duration: 5000,
            });
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setEditingUser(null)
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "ESTUDIANTE",
        })
        setPasswordErrors([])
        setIsDialogOpen(true)
    }

    const handleEdit = (user: UserData) => {
        setEditingUser(user)
        setFormData({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as "ADMINISTRADOR" | "INVESTIGADOR" | "ESTUDIANTE",
            status: user.status as "ACTIVO" | "DESACTIVADO"
        })
        setIsDialogOpen(true)
    }


    const handleDeleteClick = (id: string) => {
        setUserToDelete(id)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!userToDelete) return
        setSubmitting(true)
        try {
            const response = await fetch(`/api/auth/delete`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({id: userToDelete, status: "DESACTIVADO"}),
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update user")
            }

            toast.success("Operacion exitosa.", {
                description: data.message,
                duration: 5000,
            });
            setSubmitting(false)
            setDeleteDialogOpen(false)

            await fetchUsers()
        } catch (error) {
            toast.error("Error al eliminar al usuario.", {
                description: "Error de conexión",
                duration: 5000,
            });
        } finally {
            setUserToDelete(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            if (!editingUser) {
                // Crear usuario - Validar contraseña antes de enviar
                const errors = validatePasswordSecurity(formData.password || "")
                if (errors.length > 0) {
                    setPasswordErrors(errors)
                    toast.error("Error al crear al usuario.", {
                        description: "La contraseña no cumple con los requisitos de seguridad",
                        duration: 5000,
                    });
                    setSubmitting(false)
                    return
                }

                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                })

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to update user")
                }

                toast.success("Operacion exitosa.", {
                    description: data.message,
                    duration: 5000,
                });
            } else {
                // Editar usuario
                const response = await fetch(`/api/auth/edit`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({id: editingUser.id, role: formData.role, status: formData.status}),
                })
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to update user")
                }

                toast.success("Operacion exitosa.", {
                    description: data.message,
                    duration: 5000,
                });
            }

            setIsDialogOpen(false)
            await fetchUsers()
        } catch (error) {
            toast.error("Error en la operacion.", {
                description: "Error de conexión",
                duration: 5000,
            });
        } finally {
            setSubmitting(false)
        }
    }

    const filteredUsers = (users || []).filter(
        (user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = filterStatus === "Todos los estados" || user.status === filterStatus;

            return matchesSearch && matchesStatus;
        }
    )


    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVO":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            case "DESACTIVADO":
                return "bg-slate-500/10 text-slate-400 border-slate-500/20"
            default:
                return "bg-slate-500/10 text-slate-400 border-slate-500/20"
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case "ADMINISTRADOR":
                return "bg-purple-500/10 text-purple-400 border-purple-500/20"
            case "INVESTIGADOR":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20"
            case "ESTUDIANTE":
                return "bg-slate-500/10 text-slate-400 border-slate-500/20"
            default:
                return "bg-slate-500/10 text-slate-400 border-slate-500/20"
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Usuarios</h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {filteredUsers.length} {filteredUsers.length === 1 ? "usuario" : "usuarios"} total
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button onClick={handleCreate} size="lg" className="gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Agregar Usuario
                    </Button>
                </div>

                <div className="flex gap-3 w-full">
                    {/* Buscador */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre o email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 shadow-sm"
                        />
                    </div>

                    {/* Selector de Estados */}
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[200px] shadow-sm">
                            <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Todos los estados">Todos los estados</SelectItem>
                            {["ACTIVO", "DESACTIVADO"].map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border bg-muted/50">
                                <TableHead className="text-muted-foreground font-semibold">Usuario</TableHead>
                                <TableHead className="text-muted-foreground font-semibold">Email</TableHead>
                                <TableHead className="text-muted-foreground font-semibold">Rol</TableHead>
                                <TableHead className="text-muted-foreground font-semibold">Estado</TableHead>
                                <TableHead className="text-muted-foreground font-semibold">Creado día</TableHead>
                                <TableHead className="text-right text-muted-foreground font-semibold">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64">
                                        <div className="flex flex-col items-center justify-center gap-3 text-center">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                                <Users className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-foreground">No se encontraron usuarios</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {searchQuery || filterStatus!="Todos los estados" ? "Intenta ajustar tu búsqueda" : "Comienza agregando tu primer usuario"}
                                                </p>
                                            </div>
                                            {!searchQuery && (
                                                <Button onClick={handleCreate} variant="outline" className="mt-2 gap-2 bg-transparent">
                                                    <Plus className="h-4 w-4" />
                                                    Agregar usuario
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="border-border group">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.image || undefined} alt={user.name} />
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-foreground">{user.name}</span>
                                                {user.email === userEmail && (<p className="text-xs text-muted-foreground">(vos)</p>)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${getRoleColor(user.role)} font-medium`}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${getStatusColor(user.status)} font-medium`}>
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(user.createdAt).toLocaleDateString("es-AR", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {user.email !== userEmail && (<Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(user)}
                                                    className="h-8 w-8 hover:bg-accent"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>)}
                                                {user.status === "ACTIVO" && user.email !== userEmail && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteClick(user.id)}
                                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}

                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl">{editingUser ? "Editar Usuario" : "Agregar Nuevo Usuario"}</DialogTitle>
                            <DialogDescription>
                                {editingUser
                                    ? "Actualizar rol del usuario"
                                    : "Completa los campos para crear un nuevo usuario."}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5 py-4">
                                {editingUser ? (
                                    <>
                                        <div className="space-y-4 pb-4 border-b border-border">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-16 w-16 border-2 border-border">
                                                    <AvatarImage src={editingUser.image || undefined} alt={editingUser.name} />
                                                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                                                        {getInitials(editingUser.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-lg text-foreground">{editingUser.name}</p>
                                                    <p className="text-sm text-muted-foreground">{editingUser.email}</p>
                                                </div>
                                            </div>
                                            {editingUser.email !== userEmail && (<div className="space-y-2">
                                                <Label htmlFor="status" className="text-sm font-medium">
                                                    Estado
                                                </Label>
                                                <Select
                                                    value={formData.status}
                                                    onValueChange={(value) =>
                                                        setFormData({ ...formData, status: value as "ACTIVO" | "DESACTIVADO" })
                                                    }
                                                >
                                                    <SelectTrigger id="status" className="h-10">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ACTIVO">Activo</SelectItem>
                                                        <SelectItem value="DESACTIVADO">Desactivado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>)}

                                        </div>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="name" className="text-sm font-medium">
                                                Nombre completo
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Juan Pérez"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                className="h-10"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="email" className="text-sm font-medium">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="juan@ejemplo.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                className="h-10"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2 relative">
                                            <Label htmlFor="password" className="text-sm font-medium">
                                                Contraseña
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={(e) => {
                                                        const newPassword = e.target.value
                                                        setFormData({ ...formData, password: newPassword })
                                                        // Validar contraseña en tiempo real
                                                        const errors = validatePasswordSecurity(newPassword)
                                                        setPasswordErrors(errors)
                                                    }}
                                                    required
                                                    minLength={12}
                                                    disabled={submitting}
                                                    placeholder="••••••••"
                                                    className="h-10 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    disabled={submitting}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                                    ) : (
                                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                                    )}
                                                </button>
                                            </div>
                                            {formData.password && (
                                                <div className="space-y-2 mt-2">
                                                    <p className="text-sm font-medium text-gray-700">Seguridad de la contraseña:</p>
                                                    <div className="space-y-1">
                                                        {passwordErrors.map((error, index) => (
                                                            <p key={index} className="text-red-500 text-xs flex items-center">
                                                                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                                                                {error}
                                                            </p>
                                                        ))}
                                                        {passwordErrors.length === 0 && (
                                                            <p className="text-green-600 text-xs flex items-center">
                                                                <span className="w-1 h-1 bg-green-600 rounded-full mr-2"></span>
                                                                Contraseña segura
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-sm font-medium">
                                        Rol
                                    </Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, role: value as "ADMINISTRADOR" | "INVESTIGADOR" | "ESTUDIANTE" })
                                        }
                                    >
                                        <SelectTrigger id="role" className="h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ESTUDIANTE">Estudiante</SelectItem>
                                            <SelectItem value="INVESTIGADOR">Investigador</SelectItem>
                                            <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter className="gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={submitting || (!editingUser && passwordErrors.length > 0)} 
                                    className="gap-2"
                                >
                                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {editingUser ? "Actualizar" : "Crear"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción desactivará el usuario. El usuario no podrá iniciar sesión.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive text-white hover:bg-destructive/90"
                                disabled={submitting}
                            >
                                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Desactivar Usuario
                            </AlertDialogAction>

                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}