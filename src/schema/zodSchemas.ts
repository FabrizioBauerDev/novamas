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
  return startDateTime > new Date();
}, {
  message: "La fecha de inicio debe ser futura",
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
  return timeDiffMinutes >= 30;
}, {
  message: "La sesión debe durar al menos 30 minutos",
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

export { 
  signInSchema, 
  signUpSchema, 
  createChatGroupSchema,
  addParticipantSchema,
  removeParticipantSchema,
  searchUsersSchema,
  updateDescriptionSchema
};