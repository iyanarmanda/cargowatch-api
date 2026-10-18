import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service.js';

@Controller({
  path: 'users',
  version: '1'
})
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get()
  async findAll() {
    const data = await this.userService.findAll();
    return {
      data,
    }
  }
}
