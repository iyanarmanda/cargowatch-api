import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { userRoleEnum, truckStatusEnum, tripStatusEnum } from './schema.enum.js';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 50 }).notNull().unique(),
  password: varchar('password').notNull(),
  photoProfile: varchar('photo_profile'),
  role: userRoleEnum('role').notNull(),
  mobileToken: varchar('mobile_token', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const trucks = pgTable('trucks', {
  id: uuid('id').defaultRandom().primaryKey(),
  plateNumber: varchar('plate_number', { length: 20 }).notNull().unique(),
  deviceId: varchar('device_id', { length: 50 }).notNull().unique(),
  status: truckStatusEnum('status').default('AVAILABLE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const trips = pgTable('trips', {
  id: uuid('id').defaultRandom().primaryKey(),
  driverId: uuid('driver_id').references(() => users.id).notNull(),
  operatorId: uuid('operator_id').references(() => users.id).notNull(),
  truckId: uuid('truck_id').references(() => trucks.id).notNull(),
  status: tripStatusEnum('status').default('DRAFT').notNull(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

