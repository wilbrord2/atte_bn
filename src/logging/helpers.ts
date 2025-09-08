import * as Sentry from '@sentry/node';

export function filterAuthCrendentialsFromSentry(event: Sentry.Event) {
  const replaceWithText = '[Filtered]';

  if (event?.request?.headers['access-token']) event.request.headers['access-token'] = replaceWithText;
}
