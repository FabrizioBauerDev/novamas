import ConversationView from "@/components/statistics/ConversationView";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Conversación - ${id}`,
    description: 'Visualización detallada de una conversación individual con NoVa+ para análisis de investigación.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ConversationPage({ params }: { params: Promise<{ id: string  }> }) {
    const { id } = await params;

    return <ConversationView id={id} />
}