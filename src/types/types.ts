import { UIMessage } from 'ai';
import { z } from 'zod';
import { GenderType, CouldntStopType, PersonalIssuesType, BooleanType } from '@/lib/enums';

// Define your metadata schema
export const messageMetadataSchema = z.object({
  createdAt: z.number().optional(),
  messageTokensIn: z.number().optional(),
  messageTokensOut: z.number().optional(),
  messageTokensReasoning: z.number().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

// Create a typed UIMessage
export type MyUIMessage = UIMessage<MessageMetadata>;

// Define a type for the form data used in the evaluation form
export interface EvaluationFormData {
  gender: GenderType | "";
  age: string;
  onlineGaming: BooleanType | "";
  couldntStop: CouldntStopType | "";
  personalIssues: PersonalIssuesType | "";
  triedToQuit: BooleanType | "";
  score: number;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
}

// Define a type for the form data used in the chat group creation form
export interface CreateGroupFormData {
  name: string;
  slug: string;
  description: string;
  password: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

// Tipo para ChatGroup con información del creador y participantes
export interface ChatGroupWithCreator {
  id: string
  creatorId: string
  name: string
  slug: string
  description?: string | null
  password: string
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
  creatorName?: string | null
  participants?: {
    id: string
    name: string | null
    email: string
    joinedAt: Date
  }[]
}
