import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema.js';
import { eq, and } from 'drizzle-orm';

import type { StartTripDto } from './dtos/start-trip.dto.js';

@Injectable()
export class TripRepository {
  constructor(
    @Inject(DRIZZLE) private pg: NodePgDatabase<typeof schema>,
  ) {}

  async findActiveByDriver(driverId: string) {
    return this.pg.query.activeTrips.findFirst({
      where: and(
        eq(schema.activeTrips.driverId, driverId),
        eq(schema.activeTrips.isActive, true),
      ),
    });
  }

  async findActiveByTruck(truckId: string) {
    return this.pg.query.activeTrips.findFirst({
      where: and(
        eq(schema.activeTrips.truckId, truckId),
        eq(schema.activeTrips.isActive, true),
      ),
    });
  }

  async findActiveById(tripId: string) {
    return this.pg.query.activeTrips.findFirst({
      where: and(
        eq(schema.activeTrips.id, tripId),
        eq(schema.activeTrips.isActive, true),
      ),
    });
  }

  async findAllActive() {
    return this.pg
      .select({
        tripId: schema.activeTrips.id,
        driverId: schema.drivers.id,
        driverName: schema.drivers.name,
        truckId: schema.trucks.id,
        plateNumber: schema.trucks.plateNumber,
        deviceId: schema.trucks.deviceId,
        isActive: schema.activeTrips.isActive,
      })
      .from(schema.activeTrips)
      .innerJoin(schema.drivers, eq(schema.activeTrips.driverId, schema.drivers.id))
      .innerJoin(schema.trucks, eq(schema.activeTrips.truckId, schema.trucks.id))
      .where(eq(schema.activeTrips.isActive, true));
  }

  async create(data: StartTripDto) {
    const [newTrip] = await this.pg
      .insert(schema.activeTrips)
      .values({
        driverId: data.driverId,
        truckId: data.truckId,
        isActive: true,
      })
      .returning();

    return newTrip;
  }

  async endTrip(tripId: string) {
    const [updateTrip] = await this.pg
      .update(schema.activeTrips)
      .set({
        isActive: false,
      })
      .where(eq(schema.activeTrips.id, tripId))
      .returning();

    return updateTrip;
  }
}
