import { z } from 'zod';
import { userRoleEnum } from '../../../database/schema.enum.js';

export const registerSchema = z.object({
  name: z.string().max(100),
  email: z.string().max(50),
  role: z.enum(userRoleEnum.enumValues),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
