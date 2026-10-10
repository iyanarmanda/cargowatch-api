import { Module } from '@nestjs/common';
import { TripController } from './trip.controller.js';
import { TripService } from './trip.service.js';
import { TripRepository } from './trip.repository.js';
import { DriverModule } from '../driver/driver.modules.js';

@Module({
  imports: [DriverModule],
  controllers: [TripController],
  providers: [TripService, TripRepository]
})
export class TripModule {}
