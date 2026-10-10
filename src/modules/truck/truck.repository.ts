import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema.js';

import type { CreateTruckDto } from './dtos/create-truck.dto.js';

@Injectable()
export class TruckRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly pg: NodePgDatabase<typeof schema>
  ) {}

  async findAll() {
    return this.pg.select().from(schema.trucks);
  }

  async create(data: CreateTruckDto) {
    const [newTruck] = await this.pg
      .insert(schema.trucks)
      .values(data)
      .returning();

    return newTruck;
  }
}
