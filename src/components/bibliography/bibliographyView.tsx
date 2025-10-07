"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Plus, Search, Trash2, User, Tag } from "lucide-react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { addDocument, fetchBibliography, removeDocument } from "@/lib/actions/actions-bibliography"
import { type BibliographyItem, BIBLIOGRAPHY_CATEGORIES } from "@/types/bibliography"
import Pagination from "@/components/bibliography/Pagination"

export default function BibliographyView() {
    const [resources, setResources] = useState<BibliographyItem[]>([])
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [customTitle, setCustomTitle] = useState("")
    const [customAuthor, setCustomAuthor] = useState("")
    const [customDescription, setCustomDescription] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("Otro")
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<string>("Todas")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [deletingResource, setDeletingResource] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    useEffect(() => {
        fetchBibliography().then((data) => {
            setResources(data)
            setIsLoading(false)
        })
    }, [])

    const filteredResources = resources.filter((resource) => {
        const matchesSearch =
            resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (resource.author && resource.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesCategory = categoryFilter === "Todas" || resource.category === categoryFilter

        return matchesSearch && matchesCategory
    })

    const totalResources = filteredResources.length
    const totalPages = Math.ceil(totalResources / itemsPerPage)

    const paginatedResources = filteredResources.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleLoadMd = async () => {
        if (!selectedFile) return

        try {
            setIsLoading(true)

            const title = customTitle.trim() || selectedFile.name
            const author = customAuthor.trim() || ""
            const description = customDescription.trim() || ""

            const updatedBibliography = await addDocument(selectedFile, title, author, description, selectedCategory)
            setResources(updatedBibliography)

            // limpiar
            setSelectedFile(null)
            setCustomTitle("")
            setCustomAuthor("")
            setCustomDescription("")
            setSelectedCategory("Otro")
            setIsAddDialogOpen(false)

            const fileInput = document.getElementById("file-upload") as HTMLInputElement
            if (fileInput) fileInput.value = ""
        } catch (error) {
            console.error("Error procesando PDF:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteMd = async (id: string) => {
        try {
            setDeletingResource(id)
            const updatedBibliography = await removeDocument(id)
            setResources(updatedBibliography)
        } catch (error) {
            console.error("Error eliminando documento:", error)
        } finally {
            setDeletingResource(null)
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.name.toLowerCase().endsWith(".pdf")) {
            setSelectedFile(file)
            setCustomTitle(file.name)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="px-6 py-3">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="mb-4">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver al inicio
                            </Button>
                        </Link>

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="relative leading-9 mx-1 my-0 py-0 px-0 text-3xl">📚</div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Bibliografía</h1>
                                    <p className="text-sm text-muted-foreground">Administra la documentación del asistente</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="bg-muted/30 px-4 rounded-md min-w-[140px] border py-1.5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-primary/20 rounded-full">
                                            <FileText className="h-3 w-3 text-primary" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-muted-foreground text-sm">Total:</span>
                                            <span className="text-lg font-bold text-foreground">{totalResources}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón agregar documento */}
                                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="lg" className="px-6 py-4">
                                            <Plus className="h-5 w-5 mr-2" />
                                            Agregar Documento
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px]">
                                        <DialogHeader>
                                            <DialogTitle>Agregar documentación</DialogTitle>
                                            <DialogDescription>
                                                Sube un archivo .pdf con información relevante para el asistente.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="file-upload">Cargar archivo</Label>
                                                <Input
                                                    id="file-upload"
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    accept=".pdf"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="custom-title">Título</Label>
                                                <Input
                                                    id="custom-title"
                                                    type="text"
                                                    placeholder="Nombre del archivo por defecto"
                                                    value={customTitle}
                                                    onChange={(e) => setCustomTitle(e.target.value)}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="custom-author">Autor</Label>
                                                <Input
                                                    id="custom-author"
                                                    type="text"
                                                    placeholder="Autor opcional"
                                                    value={customAuthor}
                                                    onChange={(e) => setCustomAuthor(e.target.value)}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="custom-description">Descripción</Label>
                                                <Input
                                                    id="custom-description"
                                                    type="text"
                                                    placeholder="Breve descripción"
                                                    value={customDescription}
                                                    onChange={(e) => setCustomDescription(e.target.value)}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="category-select">Categoría</Label>
                                                <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isLoading}>
                                                    <SelectTrigger id="category-select">
                                                        <SelectValue placeholder="Selecciona una categoría" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {BIBLIOGRAPHY_CATEGORIES.map((category) => (
                                                            <SelectItem key={category} value={category}>
                                                                {category}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isLoading}>
                                                Cancelar
                                            </Button>
                                            <Button onClick={handleLoadMd} disabled={isLoading || !selectedFile}>
                                                {isLoading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                        Cargando...
                                                    </>
                                                ) : (
                                                    "Cargar documentación"
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Buscar */}
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar documentos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filtrar por categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Todas">Todas las categorías</SelectItem>
                                {BIBLIOGRAPHY_CATEGORIES.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Lista */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <Card>
                                <CardContent className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-foreground mb-2">Cargando documentos...</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : paginatedResources.length === 0 ? (
                            <Card>
                                <CardContent className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-foreground mb-2">No se encuentran documentos</h3>
                                        <p className="text-muted-foreground">
                                            {searchTerm || categoryFilter !== "Todas"
                                                ? "Prueba con otros parámetros de búsqueda."
                                                : "Agrega tu primer documento."}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            paginatedResources.map((resource) => (
                                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <FileText className="h-5 w-5 text-red-500" />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-foreground truncate">{resource.title}</h3>
                                                    {resource.category && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Tag className="h-3 w-3 text-primary" />
                                                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {resource.category}
                              </span>
                                                        </div>
                                                    )}
                                                    {resource.author && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <User className="h-3 w-3 text-muted-foreground" />
                                                            <p className="text-sm text-muted-foreground truncate">{resource.author}</p>
                                                        </div>
                                                    )}
                                                    {resource.description && (
                                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{resource.description}</p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Subido el{" "}
                                                        {new Date(resource.createdat).toLocaleDateString("es-ES", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive bg-transparent"
                                                            disabled={deletingResource === resource.id}
                                                        >
                                                            {deletingResource === resource.id ? (
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Eliminar Documentación</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                ¿Estás seguro que deseas eliminar &#34;{resource.title}&#34;? Esto removerá el documento
                                                                del asistente y no se puede deshacer.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteMd(resource.id)}
                                                                className="bg-destructive text-white hover:bg-destructive/90 hover:text-white"
                                                            >
                                                                Eliminar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Paginación */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalResources}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    )
}
