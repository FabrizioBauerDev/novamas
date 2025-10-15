import {GeneralView} from "@/components/statistics/GeneralView"
import { auth } from "@/auth"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Estadísticas',
  description: 'Panel de estadísticas y análisis de conversaciones con NoVa+. Visualiza métricas, patrones de uso y resultados de la investigación.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ChatGroupPage() {

    return <GeneralView />
}