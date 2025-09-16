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
  startTime: z.string().min(1, "La hora de inicio es obligatoria"),
  endDate: z.string().min(1, "La fecha de fin es obligatoria"),
  endTime: z.string().min(1, "La hora de fin es obligatoria"),
}).refine((data) => {
  const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
  const endDateTime = new Date(`${data.endDate}T${data.endTime}`);
  return endDateTime > startDateTime;
}, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["endDate"],
}).refine((data) => {
  const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
  return startDateTime > new Date();
}, {
  message: "La fecha de inicio debe ser futura",
  path: ["startDate"],
}).refine((data) => {
  // Si es el mismo día, validar que haya al menos 30 minutos de diferencia
  if (data.startDate === data.endDate) {
    const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
    const endDateTime = new Date(`${data.endDate}T${data.endTime}`);
    const timeDiffMs = endDateTime.getTime() - startDateTime.getTime();
    const timeDiffMinutes = timeDiffMs / (1000 * 60);
    return timeDiffMinutes >= 30;
  }
  return true;
}, {
  message: "La sesión debe durar al menos 30 minutos",
  path: ["endTime"],
});

export { signInSchema, signUpSchema, createChatGroupSchema };