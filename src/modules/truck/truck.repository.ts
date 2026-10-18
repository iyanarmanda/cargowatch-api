import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../../database/schema.js';

import type { CreateTruckSchema } from './schemas/create-truck.schema.js';
import type { TruckStatusEnum } from '../../database/schema.enum.js';

@Injectable()
export class TruckRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly pg: NodePgDatabase<typeof schema>
  ) {}

  async findAll() {
    return this.pg.select().from(schema.trucks);
  }

  async findById(id: string) {
    return this.pg.query.trucks.findFirst({
      where: eq(schema.trucks.id, id),
    });
  }

  async create(data: CreateTruckSchema) {
    const [newTruck] = await this.pg
      .insert(schema.trucks)
      .values(data)
      .returning();

    return newTruck;
  }

  async updateStatus(id: string, status: TruckStatusEnum) {
    return this.pg
      .update(schema.trucks)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.trucks.id, id));
  }
}
