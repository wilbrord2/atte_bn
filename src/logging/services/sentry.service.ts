import * as Sentry from "@sentry/node";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { SpanContext } from "@sentry/types";
import { REQUEST } from "@nestjs/core";
import type  { Request } from 'express';
import { Span } from "@sentry/tracing";

@Injectable({ scope: Scope.REQUEST })
export class SentryService {
  get span(): Span {
    return Sentry.getCurrentHub().getScope().getSpan() as any
  }

  constructor(@Inject(REQUEST) private request: Request) {
    const { method, headers, url } = this.request;

    const transaction = Sentry.startTransaction({
      name: `Route: ${method}, ${url}`,
      op: "transaction",
    });

    Sentry.getCurrentHub().configureScope((scope) => {
      scope.setSpan(transaction);

      if (request?.["user"])
        scope.setUser({ id: String(request?.["user"].id) });

      scope.setContext("http", {
        method,
        url,
        headers,
      });
    });
  }

  startChild(spanContext: SpanContext) {
    return this.span.startChild(spanContext);
  }
}

