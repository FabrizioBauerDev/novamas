"use client";

import { Card} from "@/components/ui/card";
import {useState, useEffect} from "react";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {getEnumOptions, ScaleEnum} from "@/lib/enums";
import {Button} from "@/components/ui/button";
import {FinalFormData} from "@/types/types";
import {createFinalFormAction} from "@/lib/actions/actions-finalform";
import { toast } from "sonner";
import Link from "next/link";

interface EvaluationFormProps {
  onFormComplete?: () => void;
  chatSessionId: string;
  onEvaluationSubmitted?: () => void;
}

function getLabelNumber(value: string) {
  switch (value) {
    case ScaleEnum[1]: return 1;
    case ScaleEnum[2]: return 2;
    case ScaleEnum[3]: return 3;
    case ScaleEnum[4]: return 4;
    case ScaleEnum[5]: return 5;
  }
}

export default function EvaluationForm({ onFormComplete, chatSessionId, onEvaluationSubmitted }: EvaluationFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FinalFormData>({
    chatId: chatSessionId,
    assistantDesign: undefined,
    assistantPurpose: undefined,
    assistantResponses: undefined,
    userFriendly: undefined,
    usefulToUnderstandRisks: undefined,
    average: undefined,
  });
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: getLabelNumber(value) }));
  };

  useEffect(() => {
    if (currentStep === 2) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  async function handleSubmit() {
    setLoading(true);
    try {
      const average = (formData.assistantDesign! + formData.assistantPurpose! + formData.assistantResponses! + formData.userFriendly! + formData.usefulToUnderstandRisks!) / 5;

      const result = await createFinalFormAction({
        ...formData,
        average
      });

      if (result.success) {
        setCurrentStep(2);
        // Notificar al componente padre que se completó la evaluación
        onEvaluationSubmitted?.();
      } else {
        console.log("no fue success");
        console.error("Error creando formulario final:", result.error);

        toast.error("Error al crear el formulario", {
          description: result.error || "No se pudo crear el formulario final. Por favor intenta nuevamente.",
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error("Error al crear el formulario", {
        description: "No se pudo crear el formulario final. Por favor intenta nuevamente.",
        duration: 5000,
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl p-8 shadow-2xl border-0 bg-white/95 backdrop-blur">
          {currentStep === 1 && (
              <>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Evaluación de NoVa+
                  </h2>
                  <p className="text-gray-600 text-lg mx-auto">
                    Tu opinión es valiosa. Esta evaluación nos ayudará a mejorar la experiencia del asistente.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 transition-all hover:shadow-md">
                    <Label className="text-lg font-semibold text-gray-800 block">
                      El diseño del asistente fue realista y atractivo.
                    </Label>
                    <RadioGroup
                        value={formData.assistantDesign? ScaleEnum[formData.assistantDesign] : undefined}
                        onValueChange={(value) => handleInputChange("assistantDesign", value)}
                    >
                      <div className="flex flex-wrap gap-3 mt-4">
                        {getEnumOptions(ScaleEnum)
                            .map(({value, label}) => (
                                <label key={value} htmlFor={`assistant-design-${value}`} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                                  <RadioGroupItem
                                      value={ScaleEnum[value]}
                                      id={`assistant-design-${value}`}
                                  />
                                  <Label htmlFor={`assistant-design-${value}`} className="cursor-pointer font-medium">{label}</Label>
                                </label>
                            ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 transition-all hover:shadow-md">
                    <Label className="text-lg font-semibold text-gray-800 block">
                      El asistente explicó bien su alcance y propósito.
                    </Label>
                    <RadioGroup
                        value={formData.assistantPurpose? ScaleEnum[formData.assistantPurpose]: undefined}
                        onValueChange={(value) => handleInputChange("assistantPurpose", value)}
                    >
                      <div className="flex flex-wrap gap-3 mt-4">
                        {getEnumOptions(ScaleEnum)
                            .map(({value, label}) => (
                                <label key={value} htmlFor={`assistant-purpose-${value}`} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-all cursor-pointer has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50">
                                  <RadioGroupItem
                                      value={ScaleEnum[value]}
                                      id={`assistant-purpose-${value}`}
                                  />
                                  <Label htmlFor={`assistant-purpose-${value}`} className="cursor-pointer font-medium">{label}</Label>
                                </label>
                            ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 transition-all hover:shadow-md">
                    <Label className="text-lg font-semibold text-gray-800 block">
                      Las respuestas del asistente fueron útiles, adecuadas e informativas.
                    </Label>
                    <RadioGroup
                        value={formData.assistantResponses? ScaleEnum[formData.assistantResponses] : undefined}
                        onValueChange={(value) => handleInputChange("assistantResponses", value)}
                    >
                      <div className="flex flex-wrap gap-3 mt-4">
                        {getEnumOptions(ScaleEnum)
                            .map(({value, label}) => (
                                <label key={value} htmlFor={`assistant-responses-${value}`} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-green-400 transition-all cursor-pointer has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
                                  <RadioGroupItem
                                      value={ScaleEnum[value]}
                                      id={`assistant-responses-${value}`}
                                  />
                                  <Label htmlFor={`assistant-responses-${value}`} className="cursor-pointer font-medium">{label}</Label>
                                </label>
                            ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100 transition-all hover:shadow-md">
                    <Label className="text-lg font-semibold text-gray-800  block">
                      El asistente resulta fácil de usar.
                    </Label>
                    <RadioGroup
                        value={formData.userFriendly? ScaleEnum[formData.userFriendly] : undefined}
                        onValueChange={(value) => handleInputChange("userFriendly", value)}
                    >
                      <div className="flex flex-wrap gap-3 mt-4">
                        {getEnumOptions(ScaleEnum)
                            .map(({value, label}) => (
                                <label key={value} htmlFor={`user-friendly-${value}`} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-orange-400 transition-all cursor-pointer has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50">
                                  <RadioGroupItem
                                      value={ScaleEnum[value]}
                                      id={`user-friendly-${value}`}
                                  />
                                  <Label htmlFor={`user-friendly-${value}`} className="cursor-pointer font-medium">{label}</Label>
                                </label>
                            ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border border-red-100 transition-all hover:shadow-md">
                    <Label className="text-lg font-semibold text-gray-800 block">
                      El asistente te fue de utilidad para comprender los riesgos asociados al uso excesivo del juego online.
                    </Label>
                    <RadioGroup
                        value={formData.usefulToUnderstandRisks? ScaleEnum[formData.usefulToUnderstandRisks] : undefined}
                        onValueChange={(value) => handleInputChange("usefulToUnderstandRisks", value)}
                    >
                      <div className="flex flex-wrap gap-3 mt-4">
                        {getEnumOptions(ScaleEnum)
                            .map(({value, label}) => (
                                <label key={value} htmlFor={`useful-risks-${value}`} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-red-400 transition-all cursor-pointer has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
                                  <RadioGroupItem
                                      value={ScaleEnum[value]}
                                      id={`useful-risks-${value}`}
                                  />
                                  <Label htmlFor={`useful-risks-${value}`} className="cursor-pointer font-medium">{label}</Label>
                                </label>
                            ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex space-x-4 mt-10">
                  <Button
                      onClick={handleSubmit}
                      disabled={
                          loading ||
                          formData.assistantDesign === undefined ||
                          formData.assistantPurpose === undefined ||
                          formData.assistantResponses === undefined ||
                          formData.userFriendly === undefined ||
                          formData.usefulToUnderstandRisks === undefined
                      }
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      "Finalizar Evaluación"
                    )}
                  </Button>
                </div>
              </>
          )}

          {currentStep === 2 && (
              <div className="text-center space-y-6 p-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                  ¡Muchas gracias!
                </h3>
                <p className="text-gray-700 text-lg mx-auto mb-0">
                  Hemos registrado tus respuestas. Gracias por usar NoVa+ y ser parte del proyecto.
                </p>
                <Link href="/">
                  <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] mt-6"
                  >
                    Volver al inicio
                  </Button>
                </Link>
              </div>
          )}
        </Card>
      </div>
  );
}