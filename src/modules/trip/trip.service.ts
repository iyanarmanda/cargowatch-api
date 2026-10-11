import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { TripRepository } from './trip.repository.js';
import { DriverRepository } from '../driver/driver.repository.js';

import type { StartTripDto } from './dtos/start-trip.dto.js';
import type { EndTripDto } from './dtos/end-trip.dto.js';

@Injectable()
export class TripService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly driverRepository: DriverRepository
  ) {}

  async findAllActive() {
    return this.tripRepository.findAllActive();
  }

  async startTrip(data: StartTripDto) {
    const existingDriverTrip = await this.tripRepository.findActiveByDriver(data.driverId);
    if (existingDriverTrip) {
      throw new BadRequestException('This driver still driving');
    }

    const existingTruckTrip = await this.tripRepository.findActiveByTruck(data.truckId);
    if (existingTruckTrip) {
      throw new BadRequestException('This truck in use');
    }

    await this.driverRepository.updateMobileToken(data.driverId, data.mobileToken);

    return this.tripRepository.create(data);
  }

  async endTrip(data: EndTripDto) {
    const activeTrip = await this.tripRepository.findActiveById(data.tripId);
    if (!activeTrip) {
      throw new NotFoundException('Active session not found')
    }

    return this.tripRepository.endTrip(data.tripId);
  }
}
