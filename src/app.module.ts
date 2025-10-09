import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleDestroy,
  RequestMethod,
} from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import * as Sentry from '@sentry/node';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configModuleOptions } from './app.module.config';
import { EVK, NODE_ENV } from './__helpers__';
import { BullModule } from '@nestjs/bull';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/typeorm';
import { LoggingModule } from './logging/logging.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ClassManagementModule } from './class_management/classroom.module';
import { ReviewsModule } from './reviews_management/reviews.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      ...configModuleOptions,
      load: [typeorm],
    }),
    LoggingModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get(EVK.REDIS_HOST),
          port: configService.get(EVK.REDIS_PORT),
          lazyConnect: false,
          showFriendlyErrorStack: true,
          maxRetriesPerRequest: 5,
          retryStrategy(times) {
            console.warn(`Retrying To Connect To Redis: Attempt ${times}`);
            return Math.min(times * 500, 2000);
          },
          db: configService.get(EVK.NODE_ENV) === NODE_ENV.PROD ? 1 : 0,
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          name: 'short',
          ttl: configService.get('THROTTLE_TTL_SHORT'),
          limit: configService.get('THROTTLE_LIMIT_SHORT'),
        },
        {
          name: 'medium',
          ttl: configService.get('THROTTLE_TTL_MEDIUM'),
          limit: configService.get('THROTTLE_LIMIT_MEDIUM'),
        },
        {
          name: 'long',
          ttl: configService.get('THROTTLE_TTL_LONG'),
          limit: configService.get('THROTTLE_LIMIT_LONG'),
        },
      ],
    }),
    LoggingModule,
    AuthModule,
    UserModule,
    ClassManagementModule,
    ReviewsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule, OnModuleDestroy {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(Sentry.Handlers.requestHandler())
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  onModuleDestroy() {
    this.eventEmitter.removeAllListeners();
  }
}
