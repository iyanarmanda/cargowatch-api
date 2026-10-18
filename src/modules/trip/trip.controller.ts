import { Controller, Get, Post, Patch, Param, Body, Sse, MessageEvent, UsePipes, ParseUUIDPipe } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { TripService } from './trip.service.js';
import { createTripSchema } from './schemas/create-trip.schema.js';
import { approveTripSchema } from './schemas/approve-trip.schema.js';
import { confirmStartTripSchema } from './schemas/confirm-start-trip.schema.js';
import { completeTripSchema } from './schemas/complete-trip.schema.js';
import { TripCreatedEvent } from './events/trip-created.event.js';

import type { CreateTripSchema } from './schemas/create-trip.schema.js';
import type { ApproveTripSchema } from './schemas/approve-trip.schema.js';
import type { ConfirmStartTripSchema } from './schemas/confirm-start-trip.schema.js';
import type { CompleteTripSchema } from './schemas/complete-trip.schema.js';

@Controller({
  path: 'trips',
  version: '1'
})
export class TripController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tripService: TripService,
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

  @Sse('sse/drafts')
  streamDraftTrips(): Observable<MessageEvent> {
    return fromEvent<TripCreatedEvent>(this.eventEmitter, 'trip.created').pipe(
      map((event: TripCreatedEvent) => {
        return {
          data: event.trip,
        } as MessageEvent;
      }),
    );
  }

  @Get('driver/:driverId/pending')
  async getPendingTrip(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.tripService.getPendingTripByDriver(driverId);
  }

  @Patch(':id/approval')
    async approveTrip(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(approveTripSchema)) body: ApproveTripSchema,
  ) {
    const trip = await this.tripService.approveTrip(id, body);

    return {
      status: 200,
      message: trip.message,
      data: trip.data,
    }
  }

  @Patch(':id/confirm-start')
  async confirmStartTrip(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(confirmStartTripSchema)) body: ConfirmStartTripSchema,
  ) {
    const trip = await this.tripService.confirmStartTrip(id, body);

    return {
      statusCode: 200,
      message: 'Trip confirmed successfully',
      data: trip,
    };
  }

  @Patch(':driverId/complete')
  async completeTrip(
    @Param('driverId', ParseUUIDPipe) driverId: string,
    @Body(new ZodValidationPipe(completeTripSchema)) body: CompleteTripSchema,
  ) {
    const updatedTrip = await this.tripService.completeTrip(driverId, body);

    return {
      statusCode: 200,
      message: 'Trip completed successfully',
      data: updatedTrip,
    };
  }
}
