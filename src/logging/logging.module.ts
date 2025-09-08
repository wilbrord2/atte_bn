import { Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import * as Sentry from "@sentry/node";
import { EVK, NODE_ENV } from "../__helpers__";
import { SentryInterceptor } from "./interceptors";
import { SentryService } from "./services/sentry.service";
import { filterAuthCrendentialsFromSentry } from "./helpers";

export const SENTRY_OPTIONS = "SENTRY_OPTIONS";

@Module({
  imports: [ConfigModule],
  providers: [SentryService],
})
export class LoggingModule implements OnModuleDestroy {
  static forRoot(options: Sentry.NodeOptions = {}) {
    const configService = new ConfigService();
    const sentryDefaultOptions: Sentry.NodeOptions = {
      dsn: configService.get(EVK.SENTRY_DSN),
      environment: configService.get(EVK.NODE_ENV),
      enabled: Boolean(configService.get(EVK.NODE_ENV) !== NODE_ENV.DEV),
      release: "1.0.0",
      beforeSend(event) {
        filterAuthCrendentialsFromSentry(event);
        return event;
      },
    };
    Sentry.init({ ...options, ...sentryDefaultOptions });

    return {
      module: LoggingModule,
      providers: [
        SentryService,
        {
          provide: SENTRY_OPTIONS,
          useValue: sentryDefaultOptions,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: SentryInterceptor,
        },
        {
          provide: ConfigService,
          useClass: ConfigService,
        },
      ],
      exports: [SentryService],
    };
  }

  async onModuleDestroy() {
    await Sentry.close();
  }
}
