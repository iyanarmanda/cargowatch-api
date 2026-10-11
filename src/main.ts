import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CorsConfig } from './config/cors.config.js';
import { AppModule } from './app.module.js';

import type { NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: configService.getOrThrow<string>('MQTT_URL'),
      username: configService.getOrThrow<string>('MQTT_USER'),
      password: configService.getOrThrow<string>('MQTT_PASSWORD'), 
    },
  });

  app.enableCors(CorsConfig(configService));

  await app.startAllMicroservices();

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const port = configService.get<number>('PORT', 3000);

  await app.listen(port, '0.0.0.0');
}
await bootstrap();
