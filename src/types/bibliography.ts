import {bibliographyCategoryEnum} from "@/db/schema"

export interface BibliographyItem {
    id: string
    title: string
    author: string | null
    description: string | null
    category: typeof bibliographyCategoryEnum.enumValues[number];
    createdat: Date
}


export const BIBLIOGRAPHY_CATEGORIES = [
    "Estadisticas",
    "Numeros de telefono",
    "Tecnicas de Control",
    "Otro",
]