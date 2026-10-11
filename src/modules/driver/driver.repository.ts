import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema.js';
import { eq } from 'drizzle-orm';

import type { CreateDriverDto } from './dtos/create-driver.dto.js';

@Injectable()
export class DriverRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly pg: NodePgDatabase<typeof schema>
  ) {}

  async findAll() {
    return this.pg.select().from(schema.drivers);
  }

  async create(data: CreateDriverDto) {
    const [newDriver] = await this.pg
      .insert(schema.drivers)
      .values(data)
      .returning();

    return newDriver;
  }

  async updateMobileToken(driverId: string, mobileToken: string) {
    const [updatedDriver] = await this.pg
      .update(schema.drivers)
      .set({ mobileToken })
      .where(eq(schema.drivers.id, driverId))
      .returning();

    return updatedDriver;
  }
}
