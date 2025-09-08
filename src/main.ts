import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { EVK, NODE_ENV } from './__helpers__';
import { AppModule } from './app.module';
import { createCommonServerStart, createSwaggerDocs } from './__bootstrap__';
import { NestExpressApplication } from '@nestjs/platform-express';

const environment = process.env[EVK.NODE_ENV];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    rawBody: true,
  });
  createCommonServerStart(app);

  const config = app.get(ConfigService);
  if (environment === NODE_ENV.DEV || environment === NODE_ENV.STAGE) {
    createSwaggerDocs(app, config, environment);
  }

  await app.listen(config.get(EVK.PORT));
}
bootstrap();
