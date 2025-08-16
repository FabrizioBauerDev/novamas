"use server";

import { createFormChatSession, CreateFormChatSessionParams } from "@/lib/db/mutations/chatNova";
import {headers} from "next/headers";

export async function createFormChatSessionAction(params: CreateFormChatSessionParams) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
            headersList.get('x-real-ip');
  console.log("IP del cliente:", ip);
  console.log("Ubicación obtenida: ", params.formData.location);
  return await createFormChatSession(params);
}