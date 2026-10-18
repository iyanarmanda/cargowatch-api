import { z } from 'zod';

export const completeTripSchema = z.object({
  tripId: z.string().uuid('tripId ID not valid'),
});

export type CompleteTripSchema = z.infer<typeof completeTripSchema>;

