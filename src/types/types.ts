import { UIMessage } from 'ai';
import { z } from 'zod';

// Define your metadata schema
export const messageMetadataSchema = z.object({
  createdAt: z.number().optional(),
  messageTokens: z.number().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

// Create a typed UIMessage
export type MyUIMessage = UIMessage<MessageMetadata>;

// Define a type for the form data used in the evaluation form
export interface EvaluationFormData {
  gender: string;
  age: string;
  onlineGaming: string;
  couldntStop: string;
  personalIssues: string;
  triedToQuit: string;
  score: number;
}