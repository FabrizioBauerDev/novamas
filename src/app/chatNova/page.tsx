import ChatInterface from "@/components/chat/chat-interface";

export default function ChatNovaPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Chatea con NoVa+</h1>
        <ChatInterface />
      </div>
    </div>
  )
}
