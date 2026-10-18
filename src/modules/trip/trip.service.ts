import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { TripRepository } from './trip.repository.js';
import { UserService } from '../user/user.service.js';
import { TruckService } from '../truck/truck.service.js';

import type { CreateTripSchema } from './schemas/create-trip.schema.js';
import type { StartTripSchema } from './schemas/start-trip.schema.js';
import type { EndTripSchema } from './schemas/end-trip.schema.js';

@Injectable()
export class TripService {
  constructor(
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

    return this.tripRepository.create(data);
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

  async endTrip(data: EndTripSchema) {
    const activeTrip = await this.tripRepository.findActiveById(data.tripId);
    if (!activeTrip) {
      throw new NotFoundException('Active session not found')
    }

    return this.tripRepository.endTrip(data.tripId);
  }
}
