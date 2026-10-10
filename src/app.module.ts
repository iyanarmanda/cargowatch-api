import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { EnvModule } from './core/env.module.js';
import { TelemetryModule } from './modules/telemetry/telemetry.module.js';

@Module({
  imports: [
    DatabaseModule,
    EnvModule,

    TelemetryModule
  ],
})
export class AppModule {}
