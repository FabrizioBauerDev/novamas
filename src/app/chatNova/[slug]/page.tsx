import ChatSessionValidator from '@/components/chat/chat-session-validator';

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  return <ChatSessionValidator slug={slug} />;
}
