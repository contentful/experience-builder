import { afterEach, describe, expect, it, vi } from 'vitest';
import { INCOMING_EVENTS, STUDIO_ORIGINS } from '../constants';
import { tryParseMessage } from './validations';

const messageData = {
  source: 'composability-app',
  eventType: INCOMING_EVENTS.RequestEditorMode,
  payload: {},
};

const createMessageEvent = (origin: string) =>
  new MessageEvent('message', {
    origin,
    data: JSON.stringify(messageData),
  });

describe('tryParseMessage origin validation', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each(STUDIO_ORIGINS)('accepts the trusted Studio origin %s in production', (origin) => {
    vi.stubEnv('NODE_ENV', 'production');

    expect(tryParseMessage(createMessageEvent(origin))).toMatchObject(messageData);
  });

  it.each(['http://localhost', 'http://localhost:3000'])(
    'accepts the local origin %s in development',
    (origin) => {
      vi.stubEnv('NODE_ENV', 'development');

      expect(tryParseMessage(createMessageEvent(origin))).toMatchObject(messageData);
    },
  );

  it.each(['http://localhost.example.com', 'https://localhost:3000', 'http://127.0.0.1:3000'])(
    'rejects the non-Studio origin %s in development',
    (origin) => {
      vi.stubEnv('NODE_ENV', 'development');

      expect(() => tryParseMessage(createMessageEvent(origin))).toThrow(
        `Message origin is not a trusted Studio origin: '${origin}'`,
      );
    },
  );

  it('rejects localhost origins outside development', () => {
    vi.stubEnv('NODE_ENV', 'production');

    expect(() => tryParseMessage(createMessageEvent('http://localhost:3000'))).toThrow(
      "Message origin is not a trusted Studio origin: 'http://localhost:3000'",
    );
  });
});
