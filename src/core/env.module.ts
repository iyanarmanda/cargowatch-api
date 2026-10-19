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

          PEPPER: z.string(),

          SMTP_HOST: z.string(),
          SMTP_PORT: z.preprocess((val) => (val ? Number(val) : undefined), z.number().default(587)),
          SMTP_SECURE: z.preprocess((val) => {
            if (typeof val === 'string') return val.toLowerCase() === 'true';
            return Boolean(val);
          }, z.boolean().default(false)),
          SMTP_USER: z.string(),
          SMTP_PASS: z.string(),
          MAIL_FROM: z.string(),
          MAIL_DOMAIN: z.string(),

          FCM_PROJECT_ID: z.string(),
          FCM_CLIENT_EMAIL: z.string(),
          FCM_PRIVATE_KEY: z.string(),
        });
      return schema.parse(env);
      },
    }),
  ],
})
export class EnvModule {}
