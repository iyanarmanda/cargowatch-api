import { z } from 'zod';

export const createTruckSchema = z.object({
  plateNumber: z.string().max(20),
  deviceId: z.string().max(50)
});

export type CreateTruckDto = z.infer<typeof createTruckSchema>;
