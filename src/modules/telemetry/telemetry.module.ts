import { Module } from '@nestjs/common';
import { TelemetryController } from './telemetry.controller.js';

@Module({
  imports: [],
  controllers: [TelemetryController],
  providers: [],
})
export class TelemetryModule {}
