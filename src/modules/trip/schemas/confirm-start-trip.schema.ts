import { z } from 'zod';

export const confirmStartTripSchema = z.object({
  driverId: z.string().uuid({ message: 'Driver ID is not valid' }),
  truckId: z.string().uuid({ message: 'Truck ID is not valid' }),
  mobileToken: z.string().min(1, { message: 'Mobile token is required' }),
});

export type ConfirmStartTripSchema = z.infer<typeof confirmStartTripSchema>;

