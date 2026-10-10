import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DRIZZLE } from '../../database/database.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema.js';
import { eq, and } from 'drizzle-orm';

import type { TelemetryPayloadDto } from './dtos/telemetry-payload.dto.js';

@Controller({
  path: 'telemetry',
  version: '1',
})
export class TelemetryController {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
  ) {}

  @MessagePattern('v1/telemetry/+/data')
  async handleTelemetry(@Payload() data: TelemetryPayloadDto) {
    if (!data.temp_alert && !data.shock_alert) {
      return;
    }

    console.log(`[ALERT RECEIVED] From Device: ${data.device_id}`);

    const activeTrip = await this.db.query.trucks.findFirst({
      where: eq(schema.trucks.deviceId, data.device_id),
      with: {
      },
    });
  }
}
