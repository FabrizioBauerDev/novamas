import ChatDemoContainer from '@/components/chat/chat-demo-container';

export default async function Page() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col">
      <ChatDemoContainer slug="" />
    </div>
  )
}
