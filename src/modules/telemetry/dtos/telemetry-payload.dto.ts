export interface TelemetryPayloadDto {
  device_id: string;
  temperature: number;
  g_force: number;
  temp_alert: boolean;
  shock_alert: boolean;
}
