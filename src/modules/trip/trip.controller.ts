import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { TripService } from './trip.service.js';
import { createTripSchema } from './schemas/create-trip.schema.js';
import { startTripSchema } from './schemas/start-trip.schema.js';
import { endTripSchema } from './schemas/end-trip.schema.js';

import type { CreateTripSchema } from './schemas/create-trip.schema.js';
import type { StartTripSchema } from './schemas/start-trip.schema.js';
import type { EndTripSchema } from './schemas/end-trip.schema.js';

@Controller({
  path: 'trips',
  version: '1'
})
export class TripController {
  constructor(
    private readonly tripService: TripService
  ) {}

  @Get()
  async findAll() {
    return this.tripService.findAll();
  }

  @Get('active')
  async findAllActiveTrips() {
    return this.tripService.findAllActive();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createTripSchema))
  async createTrip(@Body() body: CreateTripSchema) {
    const trip = await this.tripService.createTrip(body);

    return {
      status: 200,
      message: "Trip created successfully",
      data: trip,
    }
  }

  // @Post('start')
  // @UsePipes(new ZodValidationPipe(startTripSchema))
  // async startTrip(@Body() startTripSchema: StartTripSchema) {
  //   return this.tripService.startTrip(startTripSchema);
  // }

  @Post('end')
  @UsePipes(new ZodValidationPipe(endTripSchema))
  async endTrip(@Body() endTripSchema: EndTripSchema) {
    return this.tripService.endTrip(endTripSchema);
  }
}
