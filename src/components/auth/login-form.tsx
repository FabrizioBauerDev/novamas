"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Lock, AlertCircle, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { authenticate } from "@/lib/actions";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <form action={formAction} className="space-y-6">
        {/* Hidden redirectTo field */}
        <input type="hidden" name="redirectTo" value={callbackUrl} />

        {/* Error Message */}
        {errorMessage && (
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-500">{errorMessage}</p>
          </div>
        )}

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

        {/* Recordar sesión */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              disabled={isPending}
              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded disabled:opacity-50"
            />
            <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
              Recordar sesión
            </Label>
          </div>
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

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
