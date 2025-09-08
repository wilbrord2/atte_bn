import { Reflector } from "@nestjs/core";
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { urlencoded, json } from "express";

export function createCommonServerStart(app: INestApplication) {
  app
    .setGlobalPrefix("api")
    .use(json())
    .use(urlencoded({ extended: true }))
    .enableVersioning({ type: VersioningType.URI })
    .useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
    .useGlobalInterceptors(
      new ClassSerializerInterceptor(new Reflector(), {
        strategy: "excludeAll",
      })
    );
}
