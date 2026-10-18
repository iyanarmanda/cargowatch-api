import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { hash, verify } from 'argon2';
import { randomInt } from 'node:crypto';
import { UserService } from '../user/user.service.js';
import { UserRegisteredEvent } from './events/user-registered.event.js';

import type { LoginSchema } from './schemas/login.schema.js';
import type { RegisterSchema } from "./schemas/register.schema.js";

@Injectable()
export class AuthService {
  private readonly pepper: Buffer;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly userService: UserService,
  ) {
    const PEPPER = this.configService.getOrThrow<string>('PEPPER');
    this.pepper = Buffer.from(PEPPER);
  }

  private createCharRange(start: number, end: number): string[] {
    return Array.from({ length: end - start + 1 }, (_, i) =>
      String.fromCharCode(start + i),
    );
  }

  private generateRandomPassword(length = 8): string {
    const digits = this.createCharRange(48, 57);
    const uppercase = this.createCharRange(65, 90);
    const lowercase = this.createCharRange(97, 122);
    
    const letters = [...lowercase, ...uppercase];
    const pool = [...letters, ...digits];

    const pickRandom = (array: string[]) => array[randomInt(0, array.length)];

    const password = [pickRandom(letters), pickRandom(digits)];

    while (password.length < length) {
      password.push(pickRandom(pool));
    }

    for (let i = password.length - 1; i > 0; i--) {
      const j = randomInt(0, i + 1);
      [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join('');
  }

  async login(data: LoginSchema) {
    const user = await this.userService.findByEmail(data.email);
    
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await verify(user.password, data.password, {
      secret: this.pepper,
    });

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    return {
      user: user.name,
      email: user.email,
      role: user.role
    }
  }

  async register(data: RegisterSchema) {
    const existingUser = await this.userService.findByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const plainPassword = this.generateRandomPassword(8);

    const hashedPassword = await hash(plainPassword, {
      secret: this.pepper,
    });

    const newUser = await this.userService.create({
      ...data,
      password: hashedPassword,
      photoProfile: null,
      mobileToken: null,
    });

    this.eventEmitter.emit(
      'user.registered',
      new UserRegisteredEvent(
        newUser.email,
        newUser.name,
        newUser.role,
        plainPassword,
      )
    )

    return {
      user: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  }
}
