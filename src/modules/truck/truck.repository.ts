import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema.js';

import type { CreateTruckSchema } from './schemas/create-truck.schema.js';

@Injectable()
export class TruckRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly pg: NodePgDatabase<typeof schema>
  ) {}

  async findAll() {
    return this.pg.select().from(schema.trucks);
  }

  async create(data: CreateTruckSchema) {
    const [newTruck] = await this.pg
      .insert(schema.trucks)
      .values(data)
      .returning();

    return newTruck;
  }
}
