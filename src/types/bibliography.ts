import {bibliographyCategoryEnum} from "@/db/schema"
export type BibliographyCategory = typeof bibliographyCategoryEnum.enumValues[number];
export interface BibliographyItem {
    id: string
    title: string
    author: string | null
    description: string | null
    category: BibliographyCategory;
    createdat: Date
}


export const BIBLIOGRAPHY_CATEGORIES = [
    "Estadisticas",
    "Numeros de telefono",
    "Tecnicas de Control",
    "Otro",
]