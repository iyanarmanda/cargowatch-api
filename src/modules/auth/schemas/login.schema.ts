import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().max(50),
  password: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
