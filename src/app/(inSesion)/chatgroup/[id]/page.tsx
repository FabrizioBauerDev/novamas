import ChatGroupDetailPage from "@/components/chatgroup/ChatGroupView"

export default async function ChatGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChatGroupDetailPage id={id} />
}
