import { pgTable, uuid, varchar, timestamp, boolean, doublePrecision } from 'drizzle-orm/pg-core';

export const drivers = pgTable('drivers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  fcmToken: varchar('fcm_token', { length: 255 }),
});

export const trucks = pgTable('trucks', {
  id: uuid('id').defaultRandom().primaryKey(),
  plateNumber: varchar('plate_number', { length: 20 }).notNull().unique(),
  deviceId: varchar('device_id', { length: 50 }).notNull().unique(),
});

export const activeTrips = pgTable('active_trips', {
  id: uuid('id').defaultRandom().primaryKey(),
  driverId: uuid('driver_id').references(() => drivers.id).notNull(),
  truckId: uuid('truck_id').references(() => trucks.id).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

