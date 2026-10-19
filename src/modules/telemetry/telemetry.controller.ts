import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DRIZZLE } from '../../database/database.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema.js';
import { eq, and } from 'drizzle-orm';
import { TelemetryService } from './telemetry.service.js';

import type { TelemetryPayloadSchema } from './schemas/telemetry-payload.schema.js';

@Controller({
  path: 'telemetry',
  version: '1',
})
export class TelemetryController {
  constructor(
    private readonly telemetryService: TelemetryService
  ) {}

  @MessagePattern('v1/telemetry/+/data')
  async handleTelemetry(@Payload() data: TelemetryPayloadSchema) {
    if (!data.temp_alert && !data.shock_alert) {
      return;
    }

    await this.telemetryService.processTelemetryAlert(data);
  }
}
