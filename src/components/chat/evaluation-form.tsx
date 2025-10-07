"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface EvaluationFormProps {
  chatSessionId: string;
}

export default function EvaluationForm({ chatSessionId }: EvaluationFormProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-4 text-2xl">
            <Construction className="w-8 h-8 text-amber-500" />
            Formulario en Construcción
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="py-4">
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Evaluación Final de la Sesión
            </h2>
            
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Estamos trabajando en el formulario de evaluación para recopilar tu experiencia
              con NoVa+. Pronto podrás compartir tu opinión sobre la conversación.
            </p>

            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <p className="text-sm text-gray-700">
                  La conversación ha sido registrada.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <p className="text-sm text-gray-700">
                  Tus datos están seguros y encriptados.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <p className="text-sm text-gray-700">
                  El feedback será utilizado para mejorar NoVa+.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <p className="text-sm text-gray-500">
              Gracias por participar en esta sesión con NoVa+ 💙
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
