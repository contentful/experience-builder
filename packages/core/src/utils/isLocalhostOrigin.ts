export const isLocalhostOrigin = (origin: string) =>
  /^https?:\/\/(?:localhost|(?:[a-z0-9-]+\.)+localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(
    origin,
  );
