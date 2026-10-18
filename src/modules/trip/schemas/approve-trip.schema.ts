import { z } from 'zod';

export const approveTripSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT'], {
    message: 'Action must APPROVE or REJECT',
  }),
});

export type ApproveTripSchema = z.infer<typeof approveTripSchema>;
