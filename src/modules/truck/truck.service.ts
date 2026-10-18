import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { TruckRepository } from './truck.repository.js';

import type { CreateTruckSchema } from "./schemas/create-truck.schema.js";
import type { TruckStatusEnum } from '../../database/schema.enum.js';

@Injectable()
export class TruckService {
  constructor(
    private readonly truckRepository: TruckRepository
  ) {}

  async findAll() {
    return this.truckRepository.findAll();
  }

  async create(data: CreateTruckSchema) {
    return await this.truckRepository.create(data);
  }

  async validateTruckForTrip(truckId: string) {
    const truck = await this.truckRepository.findById(truckId);

    if (!truck) {
      throw new NotFoundException('Truck not found');
    }

    if (truck.status !== 'AVAILABLE') {
      throw new BadRequestException('Truk cannot be use (Status: ${truck.status})');
    }

    return truck;
  }

  async updateTruckStatus(truckId: string, status: TruckStatusEnum) {
    return this.truckRepository.updateStatus(truckId, status);
  }
}
