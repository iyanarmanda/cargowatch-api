import { Injectable } from '@nestjs/common';
import { DriverRepository } from './driver.repository.js';

import type { CreateDriverDto } from "./dtos/create-driver.dto.js";

@Injectable()
export class DriverService {
  constructor(
    private readonly driverRepository: DriverRepository
  ) {}

  async findAll() {
    return this.driverRepository.findAll();
  }

  async create(data: CreateDriverDto) {
    return this.driverRepository.create(data);
  }
}
