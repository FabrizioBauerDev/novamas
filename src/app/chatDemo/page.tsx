import NewChatInterface from '@/components/chat/new-chat-interface';

 export default async function Page() {

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex flex-col">
      <div className="flex flex-col h-full max-w-5xl mx-auto w-full py-4 px-4">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">Bienvenido al chat con NoVa+</h1>
        <div className="flex-1 flex flex-col">
          <NewChatInterface />
        </div>
      </div>
    </div>
  )
}
