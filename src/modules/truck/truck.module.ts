import { Module } from '@nestjs/common';
import { TruckController } from './truck.controller.js';
import { TruckService } from './truck.service.js';
import { TruckRepository } from './truck.repository.js';

@Module({
  controllers: [TruckController],
  providers: [TruckService, TruckRepository],
  exports: [TruckService],
})
export class TruckModule {}
