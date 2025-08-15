"use server";

import { createFormChatSession, CreateFormChatSessionParams } from "@/lib/db/mutations/chatNova";

export async function createFormChatSessionAction(params: CreateFormChatSessionParams) {
  return await createFormChatSession(params);
}