import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TripRepository } from './trip.repository.js';
import { UserService } from '../user/user.service.js';
import { TruckService } from '../truck/truck.service.js';
import { TripCreatedEvent } from './events/trip-created.event.js';

import type { CreateTripSchema } from './schemas/create-trip.schema.js';
import type { StartTripSchema } from './schemas/start-trip.schema.js';
import type { EndTripSchema } from './schemas/end-trip.schema.js';
import type { ApproveTripSchema } from './schemas/approve-trip.schema.js';
import type { TripStatusEnum } from '../../database/schema.enum.js';

@Injectable()
export class TripService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tripRepository: TripRepository,
    private readonly userService: UserService,
    private readonly truckService: TruckService,
  ) {}

  async findAll() {
    return this.tripRepository.findAll();
  }

  async findAllActive() {
    return this.tripRepository.findAllActive();
  }

  async createTrip(data: CreateTripSchema) {
    await this.userService.validateDriverForTrip(data.driverId);

    await this.userService.validateOperatorForTrip(data.operatorId);

    await this.truckService.validateTruckForTrip(data.truckId);

    const activeDriverTrip = await this.tripRepository.findActiveByDriver(data.driverId);
    if (activeDriverTrip) {
      throw new BadRequestException('Driver still has an active trip');
    }

    const existingTruckTrip = await this.tripRepository.findActiveByTruck(data.truckId);
    if (existingTruckTrip) {
      throw new BadRequestException('Truck is currently in use');
    }

    if (data.mobileToken) {
      await this.userService.updateMobileToken(data.driverId, data.mobileToken);
    }

    const trip = await this.tripRepository.create(data);

    this.eventEmitter.emit(
      'trip.created',
      new TripCreatedEvent(trip),
    );

    return trip;
  }

  // async startTrip(data: StartTripSchema) {
  //   const existingDriverTrip = await this.tripRepository.findActiveByDriver(data.driverId);
  //   if (existingDriverTrip) {
  //     throw new BadRequestException('This driver still driving');
  //   }
  //
  //   const existingTruckTrip = await this.tripRepository.findActiveByTruck(data.truckId);
  //   if (existingTruckTrip) {
  //     throw new BadRequestException('This truck in use');
  //   }
  //
  //   await this.userRepository.updateMobileToken(data.driverId, data.mobileToken);
  //
  //   return this.tripRepository.create(data);
  // }

  async approveTrip(tripId: string, data: ApproveTripSchema) {
    const trip = await this.tripRepository.findById(tripId);

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.status !== 'DRAFT') {
      throw new BadRequestException(
        `Trip cannot be processed (status: ${trip.status})`,
      );
    }

    let newStatus: TripStatusEnum = 'DRAFT';
    let statusMessage: string = '';

    if (data.action === 'APPROVE') {
      newStatus = 'PENDING_CONFIRM';
      statusMessage = 'Trip approved successfully';
    } else {
      newStatus = 'REJECTED';
      statusMessage = 'Trip rejected successfully';
    }

    const updatedTrip = await this.tripRepository.updateStatus(tripId, newStatus);

    // this.eventEmitter.emit('trip.status_changed', {
    //   tripId: updatedTrip.id,
    //   previousStatus: 'DRAFT',
    //   newStatus,
    // });

    return {
      data: updatedTrip,
      message: statusMessage, 
    };
  }

  async endTrip(data: EndTripSchema) {
    const activeTrip = await this.tripRepository.findActiveById(data.tripId);
    if (!activeTrip) {
      throw new NotFoundException('Active session not found')
    }

    return this.tripRepository.endTrip(data.tripId);
  }
}
