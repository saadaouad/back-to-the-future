import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { assertEnv, env } from '../env';

async function bootstrap() {
  assertEnv();

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'OPTIONS']
  });

  await app.listen(env.PORT);
  console.log(`API listening on http://localhost:${env.PORT}`);
}

bootstrap();
