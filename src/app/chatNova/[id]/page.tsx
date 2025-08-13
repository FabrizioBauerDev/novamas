import ChatInterface from "@/components/chat/chat-interface";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full py-4 px-2 sm:px-3 lg:px-4">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Bienvenido al chat con NoVa+</h1>
        <ChatInterface />
      </div>
    </div>
  );
}
