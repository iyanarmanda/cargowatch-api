import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'supervisor',
  'operator',
  'driver',
]);

export const truckStatusEnum = pgEnum('truck_status', [
  'AVAILABLE',
  'IN_USE',
  'MAINTENANCE',
  'BROKEN',
]);

export const tripStatusEnum = pgEnum('trip_status', [
  'DRAFT',            // created by operator, waiting for supervisor 
  'REJECTED',         // rejected by supervisor
  'PENDING_CONFIRM',  // accepted by supervisor, waiting for driver
  'ON_GOING',         // confirmed by driver, on trip
  'COMPLETED',        // trip completed by driver
  'CANCELLED',        // trip cancelled by driver or operator
]);

