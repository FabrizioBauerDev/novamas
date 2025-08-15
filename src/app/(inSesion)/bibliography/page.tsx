"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Plus, Search, Trash2, User } from "lucide-react"
import { addDocument, removeDocument, fetchBibliography } from "@/app/actions/bibliography"
import { BibliographyItem } from "@/types/bibliography";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function BibliographyPage() {
    const [resources, setResources] = useState<BibliographyItem[]>([])
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [customTitle, setCustomTitle] = useState("")
    const [customAuthor, setCustomAuthor] = useState("")
    const [customDescription, setCustomDescription] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [deletingResource, setDeletingResource] = useState<string | null>(null)

    const getBibliography = async () => {
        try {
            const bibliographyData = await fetchBibliography()
            setResources(bibliographyData)
        } catch (error) {
            console.log(error)
        }
    }

    const filteredResources = resources.filter(
        (resource) =>
            resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (resource.author && resource.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    const totalResources = resources.length

    useEffect(() => {
        getBibliography().then(r => setIsLoading(false))
    }, [])

    const handleDeleteMd = async (id: string) => {
        try {
            setDeletingResource(id)
            const updatedBibliography = await removeDocument(id)
            setResources(updatedBibliography)
        } catch (error) {
            console.error("Error deleting markdown:", error)
        } finally {
            setDeletingResource(null)
        }
    }

    const handleLoadMd = async () => {
        if (!selectedFile) return

        try {
            setIsLoading(true)

            const title = customTitle.trim() || selectedFile.name
            const author = customAuthor.trim() || ""
            const description = customDescription.trim() || ""

            const updatedBibliography = await addDocument(selectedFile, title, author, description)
            setResources(updatedBibliography)

            setSelectedFile(null)
            setCustomTitle("")
            setCustomAuthor("")
            setCustomDescription("")
            setIsAddDialogOpen(false)

            // Clear file input
            const fileInput = document.getElementById("file-upload") as HTMLInputElement
            if (fileInput) fileInput.value = ""
        } catch (error) {
            console.error("Error processing PDF:", error)
        } finally {
            setIsLoading(false)
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
                                            <span className="font-medium text-muted-foreground text-sm">Total de documentos:</span>
                                            <span className="text-lg font-bold text-foreground">{totalResources}</span>
                                        </div>
                                    </div>
                                </div>

                                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="lg" className="px-6 py-4">
                                            <Plus className="h-5 w-5 mr-2" />
                                            Agregar Documento
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px]">
                                        <DialogHeader>
                                            <DialogTitle>Agregar documentacion</DialogTitle>
                                            <DialogDescription>
                                                Sube un archivo .pdf que le de mas informacion relevante al asistente.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="file-upload">Cargar archivo</Label>
                                                <Input
                                                    id="file-upload"
                                                    type="file"
                                                    onChange={(e) => handleFileChange(e)}
                                                    accept=".pdf"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="custom-title">Título personalizado (opcional)</Label>
                                                <Input
                                                    id="custom-title"
                                                    type="text"
                                                    placeholder="Deja vacío para usar el nombre del archivo"
                                                    value={customTitle}
                                                    onChange={(e) => setCustomTitle(e.target.value)}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="custom-author">Autor (opcional)</Label>
                                                <Input
                                                    id="custom-author"
                                                    type="text"
                                                    placeholder="Nombre del autor"
                                                    value={customAuthor}
                                                    onChange={(e) => setCustomAuthor(e.target.value)}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="custom-description">Descripción (opcional)</Label>
                                                <Input
                                                    id="custom-description"
                                                    type="text"
                                                    placeholder="Breve descripción del documento"
                                                    value={customDescription}
                                                    onChange={(e) => setCustomDescription(e.target.value)}
                                                    disabled={isLoading}
                                                />
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
                                                    "Cargar documentacion"
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
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar documentos por título, autor o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

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
                            ) : filteredResources.length === 0 ? (
                            <Card>
                                <CardContent className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-foreground mb-2">No se encuentran documentos cargados</h3>
                                        <p className="text-muted-foreground">
                                            {searchTerm ? "Intente con otros parametros de busca." : "Agrega tu primer documento."}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredResources.map((resource) => (
                                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <FileText className="h-5 w-5 text-red-500" />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-foreground truncate">{resource.title}</h3>
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
                                                            <AlertDialogTitle>Eliminar Documentacion</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                ¿Estas seguro que deseas eliminar "{resource.title}"? Esto va a remover el documento de
                                                                el conocimiento del asistente y la acción no se puede deshacer.
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
                </div>
            </div>
        </div>
    )
}
