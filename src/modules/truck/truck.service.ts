import { Injectable } from '@nestjs/common';
import { TruckRepository } from './truck.repository.js';

import type { CreateTruckSchema } from "./schemas/create-truck.schema.js";

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
}
