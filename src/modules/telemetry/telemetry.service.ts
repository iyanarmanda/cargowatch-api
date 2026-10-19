import { Injectable, Logger } from '@nestjs/common';
import { TripService } from '../trip/trip.service.js';
import { NotificationService } from '../notification/notification.service.js';

import type { TelemetryPayloadSchema } from './schemas/telemetry-payload.schema.js';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(
    private readonly tripService: TripService,
    private readonly notificationService: NotificationService,
  ) {}

  async processTelemetryAlert(data: TelemetryPayloadSchema) {
    const activeTrip = await this.tripService.findActiveByDeviceId(data.device_id);

    if (!activeTrip) {
      this.logger.warn(`Alert received from device ${data.device_id}, but trip status is not ON_GOING.`);
      return;
    }

    if (!activeTrip.mobileToken) {
      this.logger.warn(`Driver ${activeTrip.driverName} is driving but don't have a mobileToken.`);
      return;
    }

    const alertTitles: string[] = [];
    if (data.temp_alert) alertTitles.push('Temperature anomaly detected');
    if (data.shock_alert) alertTitles.push('Shock detected');

    const title = `ALERT: ${alertTitles.join(' & ')}`;
    const body = `Anomaly detected at ${activeTrip.plateNumber}. Please check your vehicle!`;

    await this.notificationService.sendPushNotification(
      activeTrip.mobileToken,
      title,
      body,
      {
        tripId: activeTrip.tripId,
        deviceId: data.device_id,
        tempAlert: String(!!data.temp_alert),
        shockAlert: String(!!data.shock_alert),
      },
    );
  }
}
