import ChatInterface from "@/components/chat/chat-interface";

 export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  // Obtengo los mensajes del chat desde la base de datos y se los envio a ChatInterface
  // const messages = await loadChat(id); 

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full py-4 px-2 sm:px-3 lg:px-4">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Bienvenido al chat con NoVa+</h1>
        <ChatInterface />
      </div>
    </div>
  )
}
