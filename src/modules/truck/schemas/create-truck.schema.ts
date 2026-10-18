import { z } from 'zod';
import { truckStatusEnum } from '../../../database/schema.enum.js';

export const createTruckSchema = z.object({
  plateNumber: z.string().max(20),
  deviceId: z.string().max(50),
  status: z.enum(truckStatusEnum.enumValues),
});

export type CreateTruckSchema = z.infer<typeof createTruckSchema>;
