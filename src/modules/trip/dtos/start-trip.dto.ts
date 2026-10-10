import { z } from 'zod';

export const startTripSchema = z.object({
  driverId: z.string().uuid('driverId UUID not valid'),
  truckId: z.string().uuid('truckId UUID not valid'),
  fcmToken: z.string(),
});

export type StartTripDto = z.infer<typeof startTripSchema>;

