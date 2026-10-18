import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema.js';
import { eq } from 'drizzle-orm';

import type { CreateUserDto } from './dtos/create-user.dto.js';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly pg: NodePgDatabase<typeof schema>
  ) {}

  async findAll() {
    return this.pg.select().from(schema.users);
  }

  async findByEmail(email: string) {
    const [user] = await this.pg
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));
      
    return user;
  }

  async create(data: CreateUserDto) {
    const [newUser] = await this.pg
      .insert(schema.users)
      .values(data)
      .returning();

    return newUser;
  }

  async updateMobileToken(userId: string, mobileToken: string | null) {
    const [updatedUser] = await this.pg
      .update(schema.users)
      .set({ mobileToken })
      .where(eq(schema.users.id, userId))
      .returning();

    return updatedUser;
  }
}
