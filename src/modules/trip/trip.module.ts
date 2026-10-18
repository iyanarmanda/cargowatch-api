import { Module } from '@nestjs/common';
import { TripController } from './trip.controller.js';
import { TripService } from './trip.service.js';
import { TripRepository } from './trip.repository.js';
import { UserModule } from '../user/user.module.js';
import { TruckModule } from '../truck/truck.module.js';

@Module({
  imports: [UserModule, TruckModule],
  controllers: [TripController],
  providers: [TripService, TripRepository]
})
export class TripModule {}
