import PasswordRecoveryForm from '@/components/auth/password-recovery-form';

export default function PasswordRestorePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">No va más</h1>
          <h2 className="text-xl text-gray-600 font-medium">Recuperar Contraseña</h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-6">
            Ingresa el email asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          <PasswordRecoveryForm />

          {/* Enlaces adicionales */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿Volver?</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/login"
                className="w-full inline-flex justify-center py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Volver al inicio de sesión
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
