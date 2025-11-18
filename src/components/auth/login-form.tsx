"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Lock, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(undefined);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage('Correo electrónico o contraseña incorrectos.');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setErrorMessage('Algo salió mal... Intenta de nuevo.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo Usuario */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              required
              disabled={isPending}
              className="pl-10 h-11 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        {/* Campo Contraseña */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Contraseña
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              disabled={isPending}
              className="pl-10 pr-10 h-11 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
              placeholder="Tu contraseña"
            />
            <button
              type="button"
              disabled={isPending}
              className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>
        </div>
         {/* Error Message */}
        {errorMessage && (
          <div
            className="mt-4 p-3 rounded-md text-sm bg-red-50 text-red-800 border border-red-200"
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage}
          </div>
        )}

        {/* Botón de envío */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 transition-all duration-200"
        >
          {isPending ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Iniciando sesión...</span>
            </div>
          ) : (
            "Iniciar Sesión"
          )}
        </Button>
      </form>
    </div>
  );
}
