import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema.js';
import { eq, aliasedTable, desc, and, inArray } from 'drizzle-orm';

import type { CreateTripSchema } from './schemas/create-trip.schema.js';
import type { TripStatusEnum } from '../../database/schema.enum.js';

@Injectable()
export class TripRepository {
  constructor(
    @Inject(DRIZZLE) private pg: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    const driver = aliasedTable(schema.users, 'driver');
    const operator = aliasedTable(schema.users, 'operator');

    return this.pg
      .select({
        id: schema.trips.id,
        status: schema.trips.status,
        origin: schema.trips.origin,
        destination: schema.trips.destination,
        driver: {
          id: driver.id,
          name: driver.name,
        },
        operator: {
          id: operator.id,
          name: operator.name,
        },
        truck: {
          id: schema.trucks.id,
          plateNumber: schema.trucks.plateNumber,
          deviceId: schema.trucks.deviceId,
        },
        startedAt: schema.trips.startedAt,
        completedAt: schema.trips.completedAt,
        createdAt: schema.trips.createdAt,
        updatedAt: schema.trips.updatedAt,
      })
      .from(schema.trips)
      .innerJoin(driver, eq(schema.trips.driverId, driver.id))
      .innerJoin(operator, eq(schema.trips.operatorId, operator.id))
      .innerJoin(schema.trucks, eq(schema.trips.truckId, schema.trucks.id))
      .orderBy(desc(schema.trips.createdAt));
  }

  async findById(id: string) {
    return this.pg.query.trips.findFirst({
      where: eq(schema.trips.id, id),
    });
  }

  async findActiveByDriver(driverId: string) {
    return this.pg.query.trips.findFirst({
      where: and(
        eq(schema.trips.driverId, driverId),
        inArray(schema.trips.status, ['DRAFT', 'PENDING_CONFIRM', 'ON_GOING']),
      ),
    });
  }

  async findActiveByTruck(truckId: string) {
    return this.pg.query.trips.findFirst({
      where: and(
        eq(schema.trips.truckId, truckId),
        eq(schema.trips.status, 'DRAFT'),
      ),
    });
  }

  async findActiveById(tripId: string) {
    return this.pg.query.trips.findFirst({
      where: and(
        eq(schema.trips.id, tripId),
        eq(schema.trips.status, 'DRAFT'),
      ),
    });
  }

  async findActiveTripByDeviceId(deviceId: string) {
    const [result] = await this.pg
      .select({
        tripId: schema.trips.id,
        driverId: schema.users.id,
        driverName: schema.users.name,
        mobileToken: schema.users.mobileToken,
        plateNumber: schema.trucks.plateNumber,
      })
      .from(schema.trips)
      .innerJoin(schema.trucks, eq(schema.trips.truckId, schema.trucks.id))
      .innerJoin(schema.users, eq(schema.trips.driverId, schema.users.id))
      .where(
        and(
          eq(schema.trucks.deviceId, deviceId),
          eq(schema.trips.status, 'ON_GOING'),
        ),
      )
      .limit(1);

    return result ?? null;
  }

  async findAllActive() {
    return this.pg
      .select({
        tripId: schema.trips.id,
        Id: schema.users.id,
        Name: schema.users.name,
        truckId: schema.trucks.id,
        plateNumber: schema.trucks.plateNumber,
        deviceId: schema.trucks.deviceId,
        isActive: schema.trips.status,
      })
      .from(schema.trips)
      .innerJoin(schema.users, eq(schema.trips.driverId, schema.users.id))
      .innerJoin(schema.trucks, eq(schema.trips.truckId, schema.trucks.id))
      .where(eq(schema.trips.status, 'DRAFT'));
  }

  async findPendingByDriver(driverId: string) {
    const [result] = await this.pg
      .select({
        id: schema.trips.id,
        driverId: schema.trips.driverId,
        operatorId: schema.trips.operatorId,
        truckId: schema.trips.truckId,
        status: schema.trips.status,
        origin: schema.trips.origin,
        destination: schema.trips.destination,
        startedAt: schema.trips.startedAt,
        completedAt: schema.trips.completedAt,
        createdAt: schema.trips.createdAt,
        updatedAt: schema.trips.updatedAt,
        truck: {
          id: schema.trucks.id,
          plateNumber: schema.trucks.plateNumber,
          deviceId: schema.trucks.deviceId,
        },
        driver: {
          id: schema.users.id,
          name: schema.users.name,
        },
      })
      .from(schema.trips)
      .innerJoin(schema.trucks, eq(schema.trips.truckId, schema.trucks.id))
      .innerJoin(schema.users, eq(schema.trips.driverId, schema.users.id))
      .where(
        and(
          eq(schema.trips.driverId, driverId),
          eq(schema.trips.status, 'PENDING_CONFIRM'),
        ),
      )
      .limit(1);

    return result ?? null;

    // return this.pg.query.trips.findFirst({
    //   where: and(
    //     eq(schema.trips.driverId, driverId),
    //     eq(schema.trips.status, 'PENDING_CONFIRM'),
    //   )
    // });
  }

  async findActiveTripByDriver(driverId: string) {
    const [result] = await this.pg
      .select({
        id: schema.trips.id,
        driverId: schema.trips.driverId,
        operatorId: schema.trips.operatorId,
        truckId: schema.trips.truckId,
        status: schema.trips.status,
        origin: schema.trips.origin,
        destination: schema.trips.destination,
        startedAt: schema.trips.startedAt,
        completedAt: schema.trips.completedAt,
        createdAt: schema.trips.createdAt,
        updatedAt: schema.trips.updatedAt,
        truck: {
          id: schema.trucks.id,
          plateNumber: schema.trucks.plateNumber,
          deviceId: schema.trucks.deviceId,
        },
        driver: {
          id: schema.users.id,
          name: schema.users.name,
        },
      })
      .from(schema.trips)
      .innerJoin(schema.trucks, eq(schema.trips.truckId, schema.trucks.id))
      .innerJoin(schema.users, eq(schema.trips.driverId, schema.users.id))
      .where(
        and(
          eq(schema.trips.driverId, driverId),
          eq(schema.trips.status, 'ON_GOING'),
        ),
      )
      .limit(1);

    return result ?? null;
  }

  async create(data: CreateTripSchema) {
    const [newTrip] = await this.pg
      .insert(schema.trips)
      .values({
        driverId: data.driverId,
        operatorId: data.operatorId,
        truckId: data.truckId,
        destination: data.destination,
        origin: data.origin,
        status: 'DRAFT',
      })
      .returning();

    return newTrip;
  }

  async updateStatus(id: string, status: TripStatusEnum) {
    const [updatedTrip] = await this.pg
      .update(schema.trips)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(schema.trips.id, id))
      .returning();

    return updatedTrip;
  }

  async confirmStartTrip(tripId: string, truckId: string) {
    const [updatedTrip] = await this.pg
      .update(schema.trips)
      .set({
        status: 'ON_GOING',
        startedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.trips.id, tripId))
      .returning();

    return updatedTrip;

    // return this.pg.transaction(async (tx) => {
    //   const [updatedTrip] = await tx
    //     .update(schema.trips)
    //     .set({
    //       status: 'ON_GOING',
    //       startedAt: new Date(),
    //       updatedAt: new Date(),
    //     })
    //     .where(eq(schema.trips.id, tripId))
    //     .returning();
    //
    //   await tx
    //     .update(schema.trucks)
    //     .set({
    //       status: 'IN_USE',
    //       updatedAt: new Date(),
    //     })
    //     .where(eq(schema.trucks.id, truckId));
    //
    //   return updatedTrip;
    // });
  }

  async completeTrip(tripId: string) {
    const [updateTrip] = await this.pg
      .update(schema.trips)
      .set({
        status: 'COMPLETED',
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.trips.id, tripId))
      .returning();

    return updateTrip;
  }
}
