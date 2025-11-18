import {GeneralView} from "@/components/statistics/GeneralView"
import { auth } from "@/auth"
import { Metadata } from "next"
import {redirect} from "next/navigation";

export const metadata: Metadata = {
  title: 'Estadísticas',
  description: 'Panel de estadísticas y análisis de conversaciones con NoVa+. Visualiza métricas, patrones de uso y resultados de la investigación.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function StatisticsPage() {
  const session = await auth()
  const userName = session?.user?.name

  if (session?.user?.role === "ESTUDIANTE" || !userName) {
    redirect("/dashboard");
  }
  return <GeneralView currentUser={userName}/>
}