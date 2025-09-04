"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Pagination from "@/components/chatgroup/Pagination"
import { BibliographyItem } from "@/types/bibliography"

interface BibliographyListProps {
    items: BibliographyItem[]
}

export default function BibliographyList({ items }: BibliographyListProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const totalItems = items.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = items.slice(startIndex, endIndex)

    return (
        <div>
            <div className="grid gap-4">
                {currentItems.map((item, index) => (
                    <Card key={item.id} className="shadow-md rounded-2xl">
                        <CardHeader>
                            <CardTitle>
                                {startIndex + index + 1}. {item.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {item.author && (
                                <p><span className="font-semibold">Autor:</span> {item.author}</p>
                            )}
                            {item.description && (
                                <p><span className="font-semibold">Descripción:</span> {item.description}</p>
                            )}
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold">Creado:</span>{" "}
                                {new Date(item.createdat).toLocaleDateString("es-AR")}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}
