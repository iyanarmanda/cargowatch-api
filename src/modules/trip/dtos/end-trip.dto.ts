import { z } from 'zod';

export const endTripSchema = z.object({
  tripId: z.string().uuid('tripId UUID not valid'),
});

export type EndTripDto = z.infer<typeof endTripSchema>;

