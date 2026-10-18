import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module.js';
import { EnvModule } from './core/env.module.js';
import { MailModule } from './modules/mail/mail.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UserModule } from './modules/user/user.module.js';
import { TruckModule } from './modules/truck/truck.module.js';
// import { TripModule } from './modules/trip/trip.module.js';
import { TelemetryModule } from './modules/telemetry/telemetry.module.js';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    DatabaseModule,
    EnvModule,

    MailModule,
    AuthModule,
    UserModule,
    TruckModule,
    // TripModule,
    TelemetryModule
  ],
})
export class AppModule {}
