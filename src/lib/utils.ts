import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { generateId } from 'ai';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function newChatNova() {
  // Lógica para crear un nuevo chat en ChatNova
  const id = generateId();
  return id;
}