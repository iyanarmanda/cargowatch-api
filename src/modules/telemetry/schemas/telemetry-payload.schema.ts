import { z } from 'zod';

export const telemetryPayloadSchema = z.object({
  device_id: z.string().max(50),
  temperature: z.number(),
  g_force: z.number(),
  temp_alert: z.boolean(),
  shock_alert: z.boolean(),
});

export type TelemetryPayloadSchema = z.infer<typeof telemetryPayloadSchema>;
