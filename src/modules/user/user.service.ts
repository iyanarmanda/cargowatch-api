import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository.js';

import type { CreateUserDto } from "./dtos/create-user.dto.js";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async findAll() {
    return this.userRepository.findAll();
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async create(data: CreateUserDto) {
    return this.userRepository.create(data);
  }

  async validateDriverForTrip(driverId: string) {
    const user = await this.userRepository.findById(driverId);

    if (!user) {
      throw new NotFoundException('Driver not found');
    }

    if (user.role !== 'driver') {
      throw new BadRequestException('User is not a driver');
    }

    return user;
  }

  async validateOperatorForTrip(driverId: string) {
    const user = await this.userRepository.findById(driverId);
    if (!user) {
      throw new NotFoundException('Operator not found');
    }

    if (user.role !== 'operator') {
      throw new BadRequestException('User is not a operator');
    }

    return user;
  }

  async updateMobileToken(userId: string, token: string) {
    return this.userRepository.updateMobileToken(userId, token);
  }
}
