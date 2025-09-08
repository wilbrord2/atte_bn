import * as Sentry from "@sentry/node";
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
  Req,
  Scope,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { catchError, finalize, throwError } from "rxjs";
import type { Request } from 'express';
import { EVK, NODE_ENV } from "../../__helpers__";
import { SentryService } from "../services/sentry.service";

@Injectable({ scope: Scope.REQUEST })
export class SentryInterceptor implements NestInterceptor {
  private readonly enabled: boolean;
  constructor(
    private readonly sentryService: SentryService,
    private readonly configService: ConfigService
  ) {
    this.enabled = Boolean(
      this.configService.get(EVK.NODE_ENV) !== NODE_ENV.DEV
    );
  }

  intercept(ctx: ExecutionContext, next: CallHandler<any>) {
    const span = this.sentryService.startChild({ op: "transaction" });

    const req = ctx.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      catchError((err: HttpException | Error) => {
        if (
          this.enabled &&
          this.getExceptionType(err) !== "Client Exception" &&
          this.configService.get(EVK.NODE_ENV) !== NODE_ENV.DEV
        ) {
          this.sendExceptionToSentry(err, req);
        }

        return throwError(() => err);
      }),

      finalize(() => {
        span.finish();
        this.sentryService.span.finish();
      })
    );
  }

  getExceptionType(
    err: HttpException | Error
  ): "Client Exception" | "Server Exception" | "Runtime Exception" {
    if (
      err instanceof HttpException &&
      err.getStatus() >= 400 &&
      err.getStatus() < 500
    ) {
      return "Client Exception";
    }

    if (err instanceof HttpException && err.getStatus() >= 500)
      return "Server Exception";

    return "Runtime Exception";
  }

  sendExceptionToSentry(err: HttpException | Error, @Req() req: Request): void {
    if (req?.["user"])
      Sentry.setUser({
        id: String(req?.["user"].id),
        role: req?.["user"].role,
      });
    Sentry.setTag("Exception Type", this.getExceptionType(err));
    Sentry.captureException(err, this.sentryService.span.getTraceContext() as any);
    Sentry.setExtras({ body: req.body });
  }
}

