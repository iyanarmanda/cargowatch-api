import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller.js';
import { DriverService } from './driver.service.js';
import { DriverRepository } from './driver.repository.js';

@Module({
  controllers: [DriverController],
  providers: [DriverService, DriverRepository],
  exports: [DriverRepository]
})
export class DriverModule {}
