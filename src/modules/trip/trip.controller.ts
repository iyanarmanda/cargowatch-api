import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { TripService } from './trip.service.js';
import { startTripSchema } from './dtos/start-trip.dto.js';
import { endTripSchema } from './dtos/end-trip.dto.js';

import type { StartTripDto } from './dtos/start-trip.dto.js';
import type { EndTripDto } from './dtos/end-trip.dto.js';

@Controller({
  path: 'trips',
  version: '1'
})
export class TripController {
  constructor(
    private readonly tripService: TripService
  ) {}

  @Get('active')
  async findAllActiveTrips() {
    return this.tripService.findAllActive();
  }

  @Post('start')
  @UsePipes(new ZodValidationPipe(startTripSchema))
  async startTrip(@Body() startTripDto: StartTripDto) {
    return this.tripService.startTrip(startTripDto);
  }

  @Post('end')
  @UsePipes(new ZodValidationPipe(endTripSchema))
  async endTrip(@Body() endTripDto: EndTripDto) {
    return this.tripService.endTrip(endTripDto);
  }
}
