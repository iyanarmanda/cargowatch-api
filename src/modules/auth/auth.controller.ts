import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { AuthService } from './auth.service.js';
import { loginSchema } from './schemas/login.schema.js';
import { registerSchema } from './schemas/register.schema.js';

import type { LoginSchema } from './schemas/login.schema.js';
import type { RegisterSchema } from './schemas/register.schema.js';

@Controller({
  path: 'auth',
  version: '1'
})
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() body: LoginSchema) {
    const user = await this.authService.login(body);

    return {
      status: 200,
      message: 'logged in successfully',
      data: user,
    }
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() body: RegisterSchema) {
    const user = await this.authService.register(body);

    return {
      status: 201,
      message: 'User registered successfully',
      data: user,
    }
  }
}
