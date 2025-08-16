"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EvaluationFormData } from "@/types/types"
import { createFormChatSessionAction } from "@/lib/actions/actions-chat"
import Geolocalizacion from "./geolocalizacion"

interface FormularioEvaluacionProps {
  onFormComplete?: () => void
  setChatSessionID?: (id: string) => void
  slug: string
}

export default function FormularioEvaluacion({ onFormComplete, setChatSessionID, slug }: FormularioEvaluacionProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormCompleted, setIsFormCompleted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState<EvaluationFormData>({
    gender: "",
    age: "",
    onlineGaming: "",
    couldntStop: "",
    personalIssues: "",
    triedToQuit: "",
    score: 0
  });
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStep1Submit = async () => {
    if (formData.onlineGaming === "no") {
      // Si responde No, mostrar resultado final
      setIsLoading(true);
      try {
        // Incluir ubicación en formData si está disponible
        const dataToSend = {
          ...formData,
          ...(location && { location })
        };
        
        const result = await createFormChatSessionAction({ formData: dataToSend, slug });
        
        if (result.success && result.chatSessionId) {
          setIsFormCompleted(true); // Detener geolocalización
          setChatSessionID?.(result.chatSessionId);
          setCurrentStep(3);
        } else {
          console.error("Error creating chat session:", result.error);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Si responde Sí, ir al paso 2
      setCurrentStep(2)
    }
  }

  const handleStep2Submit = async () => {
    setIsLoading(true);
    try {
      // Incluir ubicación en formData si está disponible
      const dataToSend = {
        ...formData,
        ...(location && { location })
      };
      
      const result = await createFormChatSessionAction({ formData: dataToSend, slug });
      
      if (result.success && result.chatSessionId) {
        setIsFormCompleted(true); // Detener geolocalización
        setChatSessionID?.(result.chatSessionId);
        setCurrentStep(3);
      } else {
        console.error("Error creating chat session:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Evaluación de Hábitos de Juego</h2>
          <p className="text-gray-600">
            Esta evaluación nos ayudará a entender mejor tus hábitos de juego y brindarte el apoyo adecuado.
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {currentStep === 1 && "Paso 1: Información General"}
                {currentStep === 2 && "Paso 2: Evaluación Específica"}
              </span>
              {currentStep < 3 && <span className="text-sm text-gray-500">{currentStep}/2</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Geolocalización: se ejecuta continuamente hasta completar el formulario */}
            <Geolocalizacion
              isActive={!isFormCompleted}
              onLocation={(coords) => setLocation(coords)}
              onError={(err) => console.warn("Geolocalizacion error:", err)}
            />
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gender">Género</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="femenino">Femenino</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edad">Edad</Label>
                  <Input
                    id="edad"
                    type="number"
                    placeholder="Ingresa tu edad"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    min="13"
                    max="100"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label>
                    ¿Solés jugar a videojuegos o juegos de apuestas por internet (como casinos online, apuestas
                    deportivas o juegos con recompensas en dinero o ítems)?
                  </Label>
                  <RadioGroup
                    value={formData.onlineGaming}
                    onValueChange={(value) => handleInputChange("onlineGaming", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="si" />
                      <Label htmlFor="si">Sí</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    Acepto los <a className="underline" href="/terminos" target="_blank" rel="noopener noreferrer">Términos</a> y la <a className="underline" href="/privacidad" target="_blank" rel="noopener noreferrer">Política de Privacidad</a>.
                  </label>
                </div>
                <Button
                  onClick={handleStep1Submit}
                  disabled={
                    !formData.gender ||
                    !formData.age ||
                    !formData.onlineGaming ||
                    !termsAccepted ||
                    isLoading
                  }
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {isLoading ? "Cargando..." : "Continuar"}
                </Button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-4">
                  <Label>
                    En el último mes, ¿sentiste que no podías dejar de jugar aunque quisieras, o jugaste más tiempo del
                    que pensabas?
                  </Label>
                  <RadioGroup
                    value={formData.couldntStop}
                    onValueChange={(value) => handleInputChange("couldntStop", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-podia-no" />
                      <Label htmlFor="no-podia-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no-seguro" id="no-podia-noseguro" />
                      <Label htmlFor="no-podia-noseguro">No estoy seguro/a</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="no-podia-si" />
                      <Label htmlFor="no-podia-si">Sí</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label>
                    ¿Tuviste problemas en la escuela, trabajo, con tu familia o pareja por el tiempo que pasás jugando o
                    por el dinero que gastaste?
                  </Label>
                  <RadioGroup
                    value={formData.personalIssues}
                    onValueChange={(value) => handleInputChange("personalIssues", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="problemas-no" />
                      <Label htmlFor="problemas-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no-aplica" id="problemas-noaplica" />
                      <Label htmlFor="problemas-noaplica">No aplica</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="problemas-si" />
                      <Label htmlFor="problemas-si">Sí</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label>¿Alguna vez intentaste dejar de jugar o reducir el tiempo y no pudiste?</Label>
                  <RadioGroup
                    value={formData.triedToQuit}
                    onValueChange={(value) => handleInputChange("triedToQuit", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="intento-no" />
                      <Label htmlFor="intento-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="intento-si" />
                      <Label htmlFor="intento-si">Sí</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)} 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Volver
                  </Button>
                  <Button
                    onClick={handleStep2Submit}
                    disabled={!formData.couldntStop || !formData.personalIssues || !formData.triedToQuit || isLoading}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    {isLoading ? "Cargando..." : "Finalizar Evaluación"}
                  </Button>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Gracias por completar la evaluación</h3>
                  {formData.onlineGaming === "no" ? (
                    <p className="text-gray-700">
                      Basándose en tus respuestas, no pareces tener hábitos de juego online actualmente. Si en el futuro
                      necesitas apoyo o información, recuerda que estamos aquí para ayudarte.
                    </p>
                  ) : (
                    <p className="text-gray-700">
                      Hemos registrado tus respuestas. Nuestro equipo de NoVa+ puede ayudarte a analizar tus hábitos de
                      juego y brindarte el apoyo que necesites.
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <Button 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                    onClick={onFormComplete}
                  >
                    Ir al chat con NoVa+
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
