import { z } from 'zod';

export const createDriverSchema = z.object({
  name: z.string().max(100),
});

export type CreateDriverDto = z.infer<typeof createDriverSchema>;
