import BibliographyView from "@/components/bibliography/bibliographyView"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Bibliografía',
  description: 'Gestión de documentos y bibliografía de referencia utilizada por NoVa+ para generar respuestas basadas en fuentes confiables.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BibliographyPage() {
    return (
        <BibliographyView />
    )
}
