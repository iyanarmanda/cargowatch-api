export class TelemetryAlertEvent {
  constructor(
    public readonly driverId: string,
    public readonly title: string,
    public readonly body: string,
  ) {}
}
