import ChatGroupStatsView from "@/components/statistics/ChatGroupStatsView";

export default async function ChatGroupStatsPage({ params }: { params: Promise<{ chatGroupId: string  }> }) {
    const { chatGroupId } = await params;

    return <ChatGroupStatsView chatGroupId={chatGroupId}/>
}
