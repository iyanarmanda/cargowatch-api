export class TripCreatedEvent {
  constructor(
    public readonly trip: {
      id: string;
      driverId: string;
      operatorId: string;
      truckId: string;
      origin?: string | null;
      destination: string;
      status: string;
      createdAt: Date;
    },
  ) {}
}
