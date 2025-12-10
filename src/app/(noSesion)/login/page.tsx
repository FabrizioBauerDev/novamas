import LoginForm from '@/components/auth/login-form';
import LoginFormSkeleton from '@/components/auth/login-form-skeleton';
import Link from 'next/link';
import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acceso para Investigadores',
  description: 'Inicio de sesión para investigadores y profesionales autorizados de NoVa+. Accede al panel de administración y gestión del sistema.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
    const session = await auth();
    
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (session) {
      redirect('/dashboard');
    }
    
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col justify-center py-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NoVa+</h1>
          <h2 className="text-xl text-gray-600 font-medium">Acceso para Especialistas</h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
          {/* Enlaces adicionales */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿Necesitas ayuda?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/restore"
                className="w-full inline-flex justify-center py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Solo especialistas autorizados pueden acceder.
                <br />
                Para solicitar acceso, contacta al administrador del sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
