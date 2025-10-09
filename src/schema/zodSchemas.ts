import z from 'zod';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const signUpSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['ADMINISTRADOR', 'INVESTIGADOR', 'ESTUDIANTE']),
});

const createChatGroupSchema = z.object({
  name: z.string().min(1, "El nombre del grupo es obligatorio").max(100),
  slug: z.string().min(1, "El slug es obligatorio").max(50).regex(/^[a-z0-9]+$/, "Solo letras minúsculas y números"),
  description: z.string().max(500).optional(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(50),
  startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
  startTime: z.string().optional(), // Ahora opcional para fechas ISO
  endDate: z.string().min(1, "La fecha de fin es obligatoria"),
  endTime: z.string().optional(), // Ahora opcional para fechas ISO
}).refine((data) => {
  // Función helper para crear fechas
  const createDateTime = (dateStr: string, timeStr?: string) => {
    if (dateStr.includes('T') || dateStr.includes('Z')) {
      return new Date(dateStr);
    }
    return new Date(`${dateStr}T${timeStr}`);
  };

  const startDateTime = createDateTime(data.startDate, data.startTime);
  const endDateTime = createDateTime(data.endDate, data.endTime);
  return endDateTime > startDateTime;
}, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["endDate"],
}).refine((data) => {
  const createDateTime = (dateStr: string, timeStr?: string) => {
    if (dateStr.includes('T') || dateStr.includes('Z')) {
      return new Date(dateStr);
    }
    return new Date(`${dateStr}T${timeStr}`);
  };

  const startDateTime = createDateTime(data.startDate, data.startTime);
  const now = new Date();
  
  // Truncar ambas fechas a minutos para comparar (ignorar segundos y milisegundos)
  const startMinutes = new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate(), startDateTime.getHours(), startDateTime.getMinutes());
  const nowMinutes = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
  
  return startMinutes >= nowMinutes;
}, {
  message: "La fecha de inicio debe ser actual o futura",
  path: ["startDate"],
}).refine((data) => {
  const createDateTime = (dateStr: string, timeStr?: string) => {
    if (dateStr.includes('T') || dateStr.includes('Z')) {
      return new Date(dateStr);
    }
    return new Date(`${dateStr}T${timeStr}`);
  };

  const startDateTime = createDateTime(data.startDate, data.startTime);
  const endDateTime = createDateTime(data.endDate, data.endTime);
  
  const timeDiffMs = endDateTime.getTime() - startDateTime.getTime();
  const timeDiffMinutes = timeDiffMs / (1000 * 60);
  return timeDiffMinutes >= 15;
}, {
  message: "La sesión debe durar al menos 15 minutos",
  path: ["endTime"],
});

// Esquemas para gestión de participantes
const addParticipantSchema = z.object({
  chatGroupId: z.string().uuid("ID de grupo inválido"),
  userId: z.string().uuid("ID de usuario inválido"),
});

const removeParticipantSchema = z.object({
  chatGroupId: z.string().uuid("ID de grupo inválido"),
  userId: z.string().uuid("ID de usuario inválido"),
});

const searchUsersSchema = z.object({
  chatGroupId: z.string().uuid("ID de grupo inválido"),
  searchTerm: z.string().min(2, "Debe tener al menos 2 caracteres").max(50),
});

// Esquema para actualizar descripción
const updateDescriptionSchema = z.object({
  id: z.string().uuid("ID de grupo inválido"),
  description: z.string().max(500, "La descripción no puede exceder los 500 caracteres").optional(),
});

const bibliographySchema = z.object({
  id: z.string().uuid("ID de recurso inválido"),
  title: z.string().min(2, "Debe tener al menos 2 caracteres").max(50),
  author: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(["ESTADISTICAS","NUMERO_TELEFONO","TECNICAS_CONTROL","OTRO"]),
  createdAt: z.date()
});

// Esquema para el feedback de chat
const chatFeedbackSchema = z.object({
  chatSessionId: z.string().uuid("ID de sesión de chat inválido"),
  rating: z.number()
    .int("La valoración debe ser un número entero")
    .min(1, "La valoración mínima es 1")
    .max(5, "La valoración máxima es 5"),
  comment: z.string()
    .max(200, "El comentario no puede exceder los 200 caracteres")
    .optional()
    .or(z.literal(""))
    .transform(val => val === "" ? undefined : val)
});

export { 
  signInSchema, 
  signUpSchema, 
  createChatGroupSchema,
  addParticipantSchema,
  removeParticipantSchema,
  searchUsersSchema,
  updateDescriptionSchema,
  bibliographySchema,
  chatFeedbackSchema
};