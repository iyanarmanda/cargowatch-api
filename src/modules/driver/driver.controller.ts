import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import {ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { DriverService } from './driver.service.js';
import { createDriverSchema } from './dtos/create-driver.dto.js';

import type { CreateDriverDto } from './dtos/create-driver.dto.js';

@Controller({
  path: 'drivers',
  version: '1'
})
export class DriverController {
  constructor(
    private readonly driverService: DriverService
  ) {}

  @Get()
  async findAll() {
    const data = await this.driverService.findAll();
    return {
      data,
    }
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createDriverSchema))
  async create(@Body() body: CreateDriverDto) {
    const data = await this.driverService.create(body);
    return {
      status: 201,
      message: 'Driver created successfully',
      data,
    }
  }
}
