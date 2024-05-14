import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
};
const data = {
  eventType: event,
  payload: {
    entity: {
      sys: m.like({
        id: m.string(),
        type: m.string(),
        version: m.integer(),
      }),
    },
    shouldRerender: m.boolean(),
  },
};

const createPostMessageReceiver = (_event: IncomingEvent, payload) =>
  synchronousBodyHandler(() => {
    let listener: EventListener | undefined;
    vi.spyOn(window, 'addEventListener').mockImplementationOnce((_event, _listener) => {
      // _listener will be src/javascripts/features/content-preview-frame/useMessaging.ts:L172
      console.log('listener', _listener);
      listener = _listener as EventListener;
    });
    const { result } = renderHook(() => useEditorSubscriber());

    console.log(result.current);
  });

describe('Canvas Subscriber methods', () => {
  const pact = new MessageConsumerPact({
    consumer: 'ExperiencesSDKConsumer',
    provider: 'UserInterfaceProvider',
    logLevel: 'debug',
  });

  beforeEach(() => {});

  //afterEach(() => vi.resetAllMocks());

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
