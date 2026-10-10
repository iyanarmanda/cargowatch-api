import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import {ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { TruckService } from './truck.service.js';
import { createTruckSchema } from './dtos/create-truck.dto.js';

import type { CreateTruckDto } from './dtos/create-truck.dto.js';

@Controller({
  path: 'trucks',
  version: '1'
})
export class TruckController {
  constructor(
    private readonly truckService: TruckService
  ) {}

  @Get()
  async findAll() {
    const data = await this.truckService.findAll();
    return {
      data,
    }
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createTruckSchema))
  async create(@Body() body: CreateTruckDto) {
    const data = await this.truckService.create(body);
    return {
      status: 201,
      message: 'Truck created successfully',
      data,
    }
  }
}
