import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { EnvModule } from './core/env.module.js';
import { DriverModule } from './modules/driver/driver.modules.js';
import { TruckModule } from './modules/truck/truck.module.js';
import { TripModule } from './modules/trip/trip.module.js';
import { TelemetryModule } from './modules/telemetry/telemetry.module.js';

@Module({
  imports: [
    DatabaseModule,
    EnvModule,

    DriverModule,
    TruckModule,
    TripModule,
    TelemetryModule
  ],
})
export class AppModule {}
