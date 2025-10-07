"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createChatFeedbackAction } from "@/lib/actions/actions-chat";
import { chatFeedbackSchema } from "@/schema/zodSchemas";
import { toast } from "sonner";

interface FeedbackCardProps {
  chatSessionId: string;
}

export function FeedbackCard({ chatSessionId }: FeedbackCardProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación del lado del cliente
    if (rating === 0) {
      toast.error("Por favor, selecciona una valoración");
      return;
    }

    // Preparar datos para validación
    const feedbackData = {
      chatSessionId,
      rating,
      comment: comment.trim() || undefined
    };

    // Validar con Zod
    const validation = chatFeedbackSchema.safeParse(feedbackData);
    
    if (!validation.success) {
      const errors = validation.error.errors;
      toast.error(errors[0]?.message || "Error de validación");
      return;
    }

    setIsSubmitting(true);

    try {
      // Enviar feedback al servidor
      const result = await createChatFeedbackAction(validation.data);

      if (result.success) {
        toast.success("¡Gracias por tu valoración!");
        
        // Iniciar animación de salida
        setIsExiting(true);
        
        // Hacer desaparecer el cartel después de la animación
        setTimeout(() => {
          setIsVisible(false);
        }, 300);
      } else {
        toast.error(result.error || "Error al enviar la valoración");
      }
    } catch (error) {
      console.error("Error al enviar valoración:", error);
      toast.error("Error inesperado al enviar la valoración");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-3 shadow-lg transition-all duration-300 ${
        isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título */}
        <div className="text-center mb-1">
          <h4 className="text-lg font-bold text-black-900">
            ¿Qué te parece la idea de NoVa+?
          </h4>
        </div>
        {/* Valoración con estrellas */}
        <div className="mb-1">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <svg
                  className={`w-6 h-6 ${
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 fill-gray-300"
                  } transition-colors duration-150`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Comentario opcional */}
        <div className="space-y-2">
          <label
            htmlFor="feedback-comment"
            className="text-sm font-semibold text-black-800 block"
          >
            Comentario opcional
          </label>
          <div className="relative">
            <Textarea
              id="feedback-comment"
              value={comment}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 200) {
                  setComment(value);
                }
              }}
              placeholder="Cuéntanos qué piensas..."
              className="min-h-[80px] text-sm resize-none border-green-300 focus:border-green-500 focus:ring-green-500 pb-6"
              maxLength={200}
            />
            <p className="absolute bottom-2 right-2 text-xs px-1 rounded text-black-600">
              {comment.length}/200
            </p>
          </div>
        </div>

        {/* Botón de envío */}
        <Button
          type="submit"
          disabled={rating === 0 || isSubmitting}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Enviando..." : "Enviar valoración"}
        </Button>
      </form>
    </div>
  );
}
