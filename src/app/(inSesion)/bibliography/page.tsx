import BibliographyView from "@/components/bibliography/bibliographyView"
import { Metadata } from "next"
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
  title: 'Bibliografía',
  description: 'Gestión de documentos y bibliografía de referencia utilizada por NoVa+ para generar respuestas basadas en fuentes confiables.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BibliographyPage() {
    const session = await auth()

    if (session?.user?.role === "ESTUDIANTE") {
        redirect("/dashboard")
    }

    return (
        <BibliographyView />
    )
}
