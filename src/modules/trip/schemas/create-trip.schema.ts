import { z } from 'zod';

export const createTripSchema = z.object({
  driverId: z.string().uuid({ message: 'Driver ID not valid' }),
  operatorId: z.string().uuid({ message: 'Operator ID not valid' }),
  truckId: z.string().uuid({ message: 'Truck ID not valid' }),
  destination: z.string().min(1, { message: 'Destination place is required' }),
  origin: z.string().optional(),
  mobileToken: z.string().optional(),
});

export type CreateTripSchema = z.infer<typeof createTripSchema>;
