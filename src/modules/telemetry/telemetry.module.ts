import { Module } from '@nestjs/common';
import { TelemetryController } from './telemetry.controller.js';
import { TelemetryService } from './telemetry.service.js';
import { TripModule } from '../trip/trip.module.js';
import { NotificationModule } from '../notification/notification.module.js';

@Module({
  imports: [TripModule, NotificationModule],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class TelemetryModule {}
