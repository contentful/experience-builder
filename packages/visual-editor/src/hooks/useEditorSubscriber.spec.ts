import { beforeEach, describe, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEditorSubscriber } from './useEditorSubscriber';
import { IncomingEvent } from '@contentful/experiences-core/types';
import { MessageConsumerPact, synchronousBodyHandler, Matchers as m } from '@pact-foundation/pact';
import { INCOMING_EVENTS } from '@contentful/experiences-core/constants';
import { entries } from '../../test/__fixtures__/entities';

const event = INCOMING_EVENTS.UpdatedEntity;
const messagePayload = {
  eventType: event,
  payload: {
    entity: entries[0],
    shouldRerender: true,
  },
  source: 'composability-app',
};

// This shape doesn't reflect reality completely, in reality we send a stringified JSON object
const data = {
  eventType: event,
  payload: {
    entity: {
      sys: m.like({
        id: m.string(),
        type: m.string(),
        version: m.integer(),
      }),
      fields: m.like({}),
    },
    shouldRerender: m.boolean(),
  },
  source: 'composability-app',
  newAttribute: m.string(),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createPostMessageReceiver = (_event: IncomingEvent, payload) =>
  synchronousBodyHandler(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let listener: EventListener | undefined;
    vi.spyOn(window, 'addEventListener').mockImplementationOnce((_event, _listener) => {
      // _listener will be src/javascripts/features/content-preview-frame/useMessaging.ts:L172
      listener = _listener as EventListener;
    });
    renderHook(() => useEditorSubscriber());
    // TODO assert that the listener is called with the expected payload and performs the right actions
  });

describe('Canvas Subscriber methods', () => {
  const pact = new MessageConsumerPact({
    consumer: 'ExperiencesSDKConsumer',
    provider: 'UserInterfaceProvider',
    logLevel: 'info',
    // Silence warning about older spec version of existing pact files -> always overwrite existing pact files
    pactfileWriteMode: 'overwrite',
    dir: '../../pacts/visual-editor',
  });

  beforeAll(() => {
    // Monkey patch console.debug to avoid debug logs for consequently fired messages
    const origConsoleDebug = console.debug;
    const debugMessage = 'Sending message';
    console.debug = (message: unknown, ...args: unknown[]) => {
      if (`${message}`.includes(debugMessage)) {
        return;
      }
      origConsoleDebug.apply(console, [message, ...args]);
    };
  });

  beforeEach(() => {});

  it.each`
    event    | payload           | data
    ${event} | ${messagePayload} | ${data}
  `('should receive the expected payload for "$event" event', async ({ event, payload, data }) => {
    await pact
      .given(`a ${event} message is sent`)
      .expectsToReceive(`a ${event} message`)
      .withContent(data)
      .verify(createPostMessageReceiver(event, payload));
  });
});
