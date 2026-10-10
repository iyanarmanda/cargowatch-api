import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validate: (env) => {
      const schema = z.object({
          PORT: z.preprocess((val) => (val ? Number(val) : undefined), z.number().default(3000)),
          NODE_ENV: z.enum(['production', 'development', 'test']).default('production'),

          POSTGRES_URL: z.string(),
          POSTGRES_USER: z.string(),
          POSTGRES_PASSWORD: z.string(),
          POSTGRES_DB: z.string(),
          POSTGRES_PORT: z.preprocess((val) => (val ? Number(val) : undefined), z.number().default(5432)),

          REDIS_URL: z.string(),
          REDIS_HOST: z.string(),
          REDIS_PASSWORD: z.string(),
          REDIS_PORT: z.preprocess((val) => (val ? Number(val) : undefined), z.number().default(6379)),

          MQTT_URL: z.string(),
          MQTT_USER: z.string(),
          MQTT_PASSWORD: z.string(),
          MQTT_PORT: z.preprocess((val) => (val ? Number(val) : undefined), z.number().default(1883)),
          // MQTT_WS_PORT: z.preprocess((val) => (val ? Number(val) : undefined), z.number().default(9001)),
        });
      return schema.parse(env);
      },
    }),
  ],
})
export class EnvModule {}
