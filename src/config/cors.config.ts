import { ConfigService } from '@nestjs/config';

import type { FastifyCorsOptions } from '@fastify/cors';

export const CorsConfig = (
  configService: ConfigService,
): FastifyCorsOptions => {
  const isProduction = configService.get<string>('NODE_ENV', 'production') === 'production';

  if (!isProduction) {
    return {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true,
    };
  }

  const rawOrigin = configService.getOrThrow<string>('CORS_ORIGIN');
  const origin = rawOrigin.includes(',')
    ? rawOrigin.split(',').map((item) => item.trim())
    : rawOrigin;

  return {
    origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  };
};

