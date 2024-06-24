import { beforeEach, describe, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import * as treeStoreModule from '@/store/tree';
import * as entityStoreModule from '@/store/entityStore';
import { useEditorSubscriber } from './useEditorSubscriber';
import { IncomingEvent } from '@contentful/experiences-core/types';
import { MessageConsumerPact, synchronousBodyHandler, Matchers as m } from '@pact-foundation/pact';
import { INCOMING_EVENTS } from '@contentful/experiences-core/constants';
import { entries } from '../../test/__fixtures__/entities';

const event = INCOMING_EVENTS.UpdatedEntity;
const entity = entries[0];
const updatedEntity = {
  ...entity,
  sys: { ...entity.sys, version: entity.sys.version + 1 },
};
const messagePayload = {
  eventType: event,
  payload: {
    entity: updatedEntity,
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

describe('Canvas Subscriber methods', () => {
  const pact = new MessageConsumerPact({
    consumer: 'ExperiencesSDKConsumer',
    provider: 'UserInterfaceProvider',
    logLevel: 'info',
    // Silence warning about older spec version of existing pact files -> always overwrite existing pact files
    pactfileWriteMode: 'overwrite',
    dir: '../../pacts',
  });

  beforeAll(() => {
    // Monkey patch console.debug to avoid debug logs for consequently fired messages
    const origConsoleDebug = console.debug;
    const debugMessages = ['sendMessage', 'onMessage'];
    console.debug = (message: unknown, ...args: unknown[]) => {
      if (debugMessages.some((msg) => `${message}`.includes(msg))) {
        return;
      }
      origConsoleDebug.apply(console, [message, ...args]);
    };
  });

  const createPostMessageReceiver = (_event: IncomingEvent, payload: typeof messagePayload) =>
    synchronousBodyHandler(() => {
      let listener: EventListener | undefined;
      const updateNodesByUpdatedEntity = vi.fn();
      const updateEntity = vi.fn();
      vi.spyOn(treeStoreModule, 'useTreeStore').mockReturnValueOnce({ updateNodesByUpdatedEntity });
      vi.spyOn(entityStoreModule, 'useEntityStore').mockImplementation((selector) =>
        selector({
          entityStore: {
            entities: entries,
            updateEntity,
            locale: 'en-US',
          },
        } as unknown as entityStoreModule.EntityState),
      );
      vi.spyOn(window, 'addEventListener').mockImplementationOnce((_event, _listener) => {
        listener = _listener as EventListener;
      });

      renderHook(() => useEditorSubscriber());

      // assert that the listener is called with the expected payload and performs the right actions
      expect(listener).toBeDefined();
      listener!(new MessageEvent('message', { data: JSON.stringify(payload) }));
      expect(updateNodesByUpdatedEntity).toHaveBeenNthCalledWith(1, updatedEntity.sys.id);
      expect(updateEntity).toHaveBeenNthCalledWith(1, updatedEntity);
    });

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
