import z from 'zod';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const signUpSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export { signInSchema, signUpSchema };