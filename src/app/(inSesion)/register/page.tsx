"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function RegistroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    contraseña: "",
    repetirContraseña: "",
  })

  const validatePasswordSecurity = (password: string): string[] => {
    const errors: string[] = []

    if (password.length <= 8) {
      errors.push("Debe tener más de 8 caracteres")
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Debe contener al menos una mayúscula")
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Debe contener al menos una minúscula")
    }

    if (!/[\d\W]/.test(password)) {
      errors.push("Debe contener al menos un número o carácter especial")
    }

    return errors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Validar contraseña en tiempo real
    if (name === "contraseña") {
      const errors = validatePasswordSecurity(value)
      setPasswordErrors(errors)

      // Verificar si las contraseñas coinciden
      if (formData.repetirContraseña && value !== formData.repetirContraseña) {
        setPasswordsMatch(false)
      } else {
        setPasswordsMatch(true)
      }
    }

    // Validar coincidencia de contraseñas
    if (name === "repetirContraseña") {
      setPasswordsMatch(value === formData.contraseña)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que las contraseñas coincidan
    if (formData.contraseña !== formData.repetirContraseña) {
      setPasswordsMatch(false)
      return
    }

    // Validar seguridad de la contraseña
    const errors = validatePasswordSecurity(formData.contraseña)
    if (errors.length > 0) {
      setPasswordErrors(errors)
      return
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">No va más</h1>
          <p className="text-gray-600 text-lg">Registro para Especialistas</p>
        </div>

        {/* Formulario */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                  Nombre
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="contraseña" className="text-sm font-medium text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="contraseña"
                    name="contraseña"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={formData.contraseña}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Indicadores de seguridad de contraseña */}
              {formData.contraseña && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Seguridad de la contraseña:</p>
                  <div className="space-y-1">
                    {passwordErrors.map((error, index) => (
                      <p key={index} className="text-red-500 text-xs flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {error}
                      </p>
                    ))}
                    {passwordErrors.length === 0 && (
                      <p className="text-green-600 text-xs flex items-center">
                        <span className="w-1 h-1 bg-green-600 rounded-full mr-2"></span>
                        Contraseña segura
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Campo Repetir Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="repetirContraseña" className="text-sm font-medium text-gray-700">
                  Repetir Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="repetirContraseña"
                    name="repetirContraseña"
                    type={showRepeatPassword ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    value={formData.repetirContraseña}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                      !passwordsMatch && formData.repetirContraseña
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showRepeatPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {!passwordsMatch && formData.repetirContraseña && (
                  <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>
                )}
              </div>

              {/* Botón de registro */}
              <Button
                type="submit"
                disabled={
                  passwordErrors.length > 0 ||
                  !passwordsMatch ||
                  !formData.nombre ||
                  !formData.email ||
                  !formData.contraseña ||
                  !formData.repetirContraseña
                }
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
              >
                Crear Cuenta
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
