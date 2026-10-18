import { Injectable } from '@nestjs/common';
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
}
