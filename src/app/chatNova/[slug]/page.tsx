import ChatDemoContainer from '@/components/chat/chat-demo-container';

// ACÁ PRIMERO SE DEBE OBTENER EL SLUG, SI EL SLUG EXISTE EN LA BD Y ESTA ACTIVO
// ENTONCES PRIMERO MOSTRARÍAMOS UN CARTEL DE BIENVENIDA CON INGRESO DE CONTRASEÑA
// Y LUEGO RECIEN EFECTIVAMENTE EL CHAT NORMAL

export default async function Page() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col">
      <ChatDemoContainer />
    </div>
  )
}
