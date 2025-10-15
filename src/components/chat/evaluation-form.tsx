"use client";

import { Card} from "@/components/ui/card";
import {useState} from "react";
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

export default function EvaluationForm({ onFormComplete, chatSessionId }: EvaluationFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FinalFormData>({
    chatId: chatSessionId,
    assistantDesign: undefined,
    assistantPurpose: undefined,
    assistantResponses: undefined,
    userFriendly: undefined,
    usefulToUnderstandRisks: undefined,
  });
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: getLabelNumber(value) }));
  };

  async function handleSubmit() {
    setLoading(true);
    try {
      console.log("Submitting...");
      const result = await createFinalFormAction(formData);

      if (result.success) {
        setCurrentStep(2);
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
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-6">
          {currentStep === 1 && (
              <>
                <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Evaluación de la utilización del asistente NoVa+
            </h2>
            <p className="text-gray-600">
              Esta evaluación nos ayudará a mejorar y aprender sobre como fue
              la experiencia de utilizar al asistente.
            </p>
          </div>

                <div className="space-y-4 mb-6">
                  <Label>
                    El diseño del asistente fue realista y atractivo.
                  </Label>
                  <RadioGroup
                      value={formData.assistantDesign? ScaleEnum[formData.assistantDesign] : undefined}
                      onValueChange={(value) => handleInputChange("assistantDesign", value)}
                  >
                    <div className="flex flex-wrap gap-4">
                      {getEnumOptions(ScaleEnum)
                          .map(({value, label}) => (
                              <div key={value} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={ScaleEnum[value]}
                                    id={`assistant-design-${value}`}
                                />
                                <Label htmlFor={`assistant-design-${value}`}>{label}</Label>
                              </div>
                          ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4 mb-6">
                  <Label>
                    El asistente explicó bien su alcance y propósito.
                  </Label>
                  <RadioGroup
                      value={formData.assistantPurpose? ScaleEnum[formData.assistantPurpose]: undefined}
                      onValueChange={(value) => handleInputChange("assistantPurpose", value)}
                  >
                    <div className="flex flex-wrap gap-4">
                      {getEnumOptions(ScaleEnum)
                          .map(({value, label}) => (
                              <div key={value} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={ScaleEnum[value]}
                                    id={`assistant-purpose-${value}`}
                                />
                                <Label htmlFor={`assistant-purpose-${value}`}>{label}</Label>
                              </div>
                          ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4 mb-6">
                  <Label>
                    Las respuestas del asistente fueron útiles, adecuadas e informativas.
                  </Label>
                  <RadioGroup
                      value={formData.assistantResponses? ScaleEnum[formData.assistantResponses] : undefined}
                      onValueChange={(value) => handleInputChange("assistantResponses", value)}
                  >
                    <div className="flex flex-wrap gap-4">
                      {getEnumOptions(ScaleEnum)
                          .map(({value, label}) => (
                              <div key={value} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={ScaleEnum[value]}
                                    id={`assistant-responses-${value}`}
                                />
                                <Label htmlFor={`assistant-responses-${value}`}>{label}</Label>
                              </div>
                          ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4 mb-6">
                  <Label>
                    El asistente resulta fácil de usar.
                  </Label>
                  <RadioGroup
                      value={formData.userFriendly? ScaleEnum[formData.userFriendly] : undefined}
                      onValueChange={(value) => handleInputChange("userFriendly", value)}
                  >
                    <div className="flex flex-wrap gap-4">
                      {getEnumOptions(ScaleEnum)
                          .map(({value, label}) => (
                              <div key={value} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={ScaleEnum[value]}
                                    id={`user-friendly-${value}`}
                                />
                                <Label htmlFor={`user-friendly-${value}`}>{label}</Label>
                              </div>
                          ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4 mb-6">
                  <Label>
                    El asistente te fue de utilidad para comprender los riesgos asociados al
                    uso excesivo del juego online.
                  </Label>
                  <RadioGroup
                      value={formData.usefulToUnderstandRisks? ScaleEnum[formData.usefulToUnderstandRisks] : undefined}
                      onValueChange={(value) => handleInputChange("usefulToUnderstandRisks", value)}
                  >
                    <div className="flex flex-wrap gap-4">
                      {getEnumOptions(ScaleEnum)
                          .map(({value, label}) => (
                              <div key={value} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={ScaleEnum[value]}
                                    id={`useful-risks-${value}`}
                                />
                                <Label htmlFor={`useful-risks-${value}`}>{label}</Label>
                              </div>
                          ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex space-x-4">
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
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    {loading ? "Cargando..." : "Finalizar Evaluación"}
                  </Button>
                </div>
              </>
          )}

          {currentStep === 2 && (
              <div className="text-center space-y-6 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Muchas gracias por completar el formulario
                </h3>
                <p className="text-gray-700">
                  Hemos registrado tus respuestas. Nuestro equipo de NoVa+ podrá analizarlos para
                  el trabajo de investigación.
                </p>
                <Link href="/">
                  <Button
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white mt-4"
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