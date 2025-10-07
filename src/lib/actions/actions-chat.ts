"use server";

import {
  createFormChatSession,
  CreateFormChatSessionParams,
  createChatFeedback,
  CreateChatFeedbackParams,
  CreateChatFeedbackResult,
} from "@/lib/db/mutations/chatNova";
import { headers } from "next/headers";

export async function createFormChatSessionAction(
  params: CreateFormChatSessionParams
) {
  try {
    // Validar que los campos requeridos estén presentes
    const { formData } = params;
    
    if (!formData.gender || !formData.age || !formData.onlineGaming) {
      return {
        success: false,
        error: "Campos requeridos faltantes"
      };
    }
    
    // Validar rango de edad
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 13 || age > 99) {
      return {
        success: false,
        error: "La edad debe estar entre 13 y 99 años"
      };
    }
    
    // Si onlineGaming es false, los otros campos pueden estar vacíos
    if (formData.onlineGaming === "true") {
      if (!formData.couldntStop || !formData.personalIssues || !formData.triedToQuit) {
        return {
          success: false,
          error: "Todos los campos del paso 2 son requeridos"
        };
      }
    } else {
      // Si no juega online, setear valores por defecto para el cálculo
      formData.couldntStop = "NO";
      formData.personalIssues = "NO";
      formData.triedToQuit = "false";
    }
    
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip");
    
    console.log("IP del cliente:", ip);
    
    if (params.formData.location) {
      console.log("Ubicación obtenida: ", params.formData.location);
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${params.formData.location.latitude}&lon=${params.formData.location.longitude}&zoom=14&format=json`
        );
        const data = await response.json();
        console.log("Ubicación geográfica:", data);
      } catch (geoError) {
        console.warn("Error obteniendo ubicación geográfica:", geoError);
      }
    }
    
    return await createFormChatSession(params);
    
  } catch (error) {
    console.error("Error en createFormChatSessionAction:", error);
    return {
      success: false,
      error: "Error interno del servidor"
    };
  }
}

export async function createChatFeedbackAction(
  params: CreateChatFeedbackParams
): Promise<CreateChatFeedbackResult> {
  try {
    // Validaciones del lado del servidor (duplicadas por seguridad)
    const { chatSessionId, rating, comment } = params;
    
    // Validar chatSessionId
    if (!chatSessionId || typeof chatSessionId !== "string") {
      return {
        success: false,
        error: "ID de sesión de chat inválido"
      };
    }
    
    // Validar rating
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return {
        success: false,
        error: "La valoración debe ser un número entre 1 y 5"
      };
    }
    
    // Validar comentario opcional
    if (comment !== undefined && comment !== null) {
      if (typeof comment !== "string") {
        return {
          success: false,
          error: "El comentario debe ser una cadena de texto"
        };
      }
      
      if (comment.length > 200) {
        return {
          success: false,
          error: "El comentario no puede exceder los 200 caracteres"
        };
      }
    }
    
    // Llamar a la función de mutación
    return await createChatFeedback(params);
    
  } catch (error) {
    console.error("Error en createChatFeedbackAction:", error);
    return {
      success: false,
      error: "Error interno del servidor al procesar la valoración"
    };
  }
}
