import { Injectable } from '@nestjs/common';
import { TruckRepository } from './truck.repository.js';

import type { CreateTruckDto } from "./dtos/create-truck.dto.js";

@Injectable()
export class TruckService {
  constructor(
    private readonly truckRepository: TruckRepository
  ) {}

  async findAll() {
    return this.truckRepository.findAll();
  }

  async create(data: CreateTruckDto) {
    return this.truckRepository.create(data);
  }
}
