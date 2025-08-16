import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { generateId } from 'ai';
import { EvaluationFormData } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function newChatNova() {
  // Lógica para crear un nuevo chat en ChatNova
  const id = generateId();
  return id;
}

// ESTA FUNCION PASARLA AL BACK CUANDO SE CREE EL evaluationForm en la BD
export function calcScore(formData: EvaluationFormData) {
    let score = 0;
    if(formData.couldntStop === "si") {
        score += 2;
    }
    if(formData.couldntStop === "no-seguro") {
        score += 1;
    }
    if(formData.personalIssues === "si") {
        score += 2;
    }
    if(formData.triedToQuit === "si") {
        score += 2;
    }
    return score;
}