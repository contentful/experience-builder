import { describe, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as treeStoreModule from '@/store/tree';
import * as entityStoreModule from '@/store/entityStore';
import { useEditorSubscriber } from './useEditorSubscriber';
import {
  AssembliesAddedPayload,
  AssembliesRegisteredPayload,
  IncomingMouseMovePayload,
  IncomingEvent,
  UpdatedEntityPayload,
  ComponentDraggingChangedPayload,
  HoverComponentPayload,
  SelectComponentPayload,
  CanvasResizedPayload,
  ExperienceUpdatedPayload,
} from '@contentful/experiences-core/types';
import { asynchronousBodyHandler } from '@pact-foundation/pact';
import { entityIds, entries } from '../../test/__fixtures__/entities';
import { interactions, InteractionIds, PactConsumer } from '../../test/pact';
import { assembliesRegistry, componentRegistry } from '@/store/registries';
import { useDraggedItemStore } from '@/store/draggedItem';
import simulateDnD from '@/utils/simulateDnD';
import * as communicationModule from '@/communication/sendSelectedComponentCoordinates';
import { useEditorStore } from '@/store/editor';
import * as coreModule from '@contentful/experiences-core';
import { EditorModeEntityStore } from '@contentful/experiences-core';
import { INCOMING_EVENTS } from '@contentful/experiences-core/constants';

const updateNodesByUpdatedEntity = vi.fn();
const updateEntity = vi.fn();
const updateTree = vi.fn();

const expectations = {
  [InteractionIds.experienceTreeUpdatedInteractionId]: (payload: ExperienceUpdatedPayload) => {
    expect(updateTree).toHaveBeenCalledWith(payload.tree);
    expect(coreModule.getDataFromTree).toHaveBeenCalled();
  },
  [InteractionIds.experienceNodeUpdatedInteractionId]: (payload: ExperienceUpdatedPayload) => {
    expect(updateTree).toHaveBeenCalledWith(payload.tree);
    expect(useEditorStore.getState().unboundValues).toStrictEqual(
      payload.changedNode?.data?.unboundValues,
    );
    expect(coreModule.getDataFromTree).not.toHaveBeenCalled();
  },
  [InteractionIds.assembliesAddedInteractionId]: (payload: AssembliesAddedPayload) => {
    const assemblyLink = { sys: { id: payload.assembly.sys.id, linkType: 'Entry', type: 'Link' } };
    expect(updateEntity).toHaveBeenNthCalledWith(1, payload.assembly);
    expect(assembliesRegistry.get(payload.assembly.sys.id)).toEqual(assemblyLink);
    const registration = componentRegistry.get(payload.assembly.sys.id);
    expect(registration?.definition).toEqual(payload.assemblyDefinition);
  },
  [InteractionIds.assembliesRegisteredInteractionId]: (payload: AssembliesRegisteredPayload) => {
    const registration = componentRegistry.get(payload.assemblies[0].id);
    expect(registration?.definition).toEqual(payload.assemblies[0]);
  },
  [InteractionIds.updatedEntityInteractionId]: (payload: UpdatedEntityPayload) => {
    expect(updateNodesByUpdatedEntity).toHaveBeenNthCalledWith(1, payload.entity.sys.id);
    expect(updateEntity).toHaveBeenNthCalledWith(1, payload.entity);
  },
  [InteractionIds.mouseMoveInteractionId]: (payload: IncomingMouseMovePayload) => {
    expect(useDraggedItemStore.getState().mouseX).toBe(payload.mouseX);
    expect(useDraggedItemStore.getState().mouseY).toBe(payload.mouseY);
    expect(simulateDnD.updateDrag).toHaveBeenCalledWith(payload.mouseX, payload.mouseY);
  },
  [InteractionIds.componentDraggingChangedInteractionId]: (
    payload: ComponentDraggingChangedPayload,
  ) => {
    expect(useDraggedItemStore.getState().componentId).toBe('');
    expect(useDraggedItemStore.getState().isDraggingOnCanvas).toBe(payload.isDragging);
  },
  [InteractionIds.componentMoveEndedInteractionId]: (payload: IncomingMouseMovePayload) => {
    expect(simulateDnD.endDrag).toHaveBeenCalledWith(payload.mouseX, payload.mouseY);
  },
  [InteractionIds.hoverComponentInteractionId]: (payload: HoverComponentPayload) => {
    expect(useDraggedItemStore.getState().hoveredComponentId).toBe(payload.hoveredNodeId);
  },
  [InteractionIds.selectComponentInteractionId]: (payload: SelectComponentPayload) => {
    expect(communicationModule.sendSelectedComponentCoordinates).toHaveBeenCalledWith(
      payload.selectedNodeId,
    );
  },
  [InteractionIds.canvasResizedInteractionId]: (payload: CanvasResizedPayload) => {
    expect(communicationModule.sendSelectedComponentCoordinates).toHaveBeenCalledWith(
      payload.selectedNodeId,
    );
  },
};

describe('Canvas Subscriber methods', () => {
  beforeAll(() => {
    // Monkey patch console.debug to avoid debug logs for consequently fired messages
    const origConsoleDebug = console.debug;
    const origConsoleWarn = console.warn;
    const debugMessages = ['sendMessage', 'onMessage'];
    console.debug = (message: unknown, ...args: unknown[]) => {
      if (debugMessages.some((msg) => `${message}`.includes(msg))) {
        return;
      }
      origConsoleDebug.apply(console, [message, ...args]);
    };
    console.warn = (message: unknown, ...args: unknown[]) => {
      if (debugMessages.some((msg) => `${message}`.includes(msg))) {
        return;
      }
      origConsoleWarn.apply(console, [message, ...args]);
    };
  });

  beforeEach(() => {
    vi.spyOn(treeStoreModule, 'useTreeStore').mockReturnValue({
      updateNodesByUpdatedEntity,
      updateTree,
    });
    vi.spyOn(entityStoreModule, 'useEntityStore').mockImplementation((selector) =>
      selector({
        entityStore: {
          entities: entries,
          updateEntity,
          locale: 'en-US',
          getMissingEntityIds: vi.fn(() => ({ missingAssetIds: [], missingEntryIds: [] })),
        },
        setEntitiesFetched: vi.fn(),
        setFetchingEntities: vi.fn(),
      } as unknown as entityStoreModule.EntityState),
    );
    vi.spyOn(coreModule, 'getDataFromTree');
    vi.spyOn(simulateDnD, 'updateDrag');
    vi.spyOn(simulateDnD, 'endDrag');
    vi.spyOn(communicationModule, 'sendSelectedComponentCoordinates');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const createPostMessageReceiver = (_event: IncomingEvent, payload, expectations) =>
    asynchronousBodyHandler(async () => {
      let listener: EventListener | undefined;

      vi.spyOn(window, 'addEventListener').mockImplementationOnce((_event, _listener) => {
        listener = _listener as EventListener;
      });

      renderHook(() => useEditorSubscriber());

      // assert that the listener is called with the expected payload and performs the right actions
      expect(listener).toBeDefined();
      await act(() => listener!(new MessageEvent('message', { data: JSON.stringify(payload) })));

      expectations?.(payload.payload);
    });

  const createPostMessageReceiverForSelectedEntities = (_event: IncomingEvent, payload) =>
    asynchronousBodyHandler(async () => {
      const store = new EditorModeEntityStore({ entities: [], locale: 'en-US' });
      let listener;
      vi.spyOn(window, 'addEventListener').mockImplementationOnce((_event, _listener) => {
        listener = _listener;
      });

      const promise = store.fetchEntries([entityIds.ENTRY1, entityIds.ENTRY2]);

      expect(listener).toBeDefined();
      listener(new MessageEvent('message', { data: JSON.stringify(payload) }));

      await promise;

      expect(store.entities).toEqual(expect.arrayContaining(entries));
    });

  it.each(interactions)(
    'should receive the expected payload for $event event',
    async ({ id, description, event, payload, payloadMatcher }) => {
      let messageReceiverConstructor = createPostMessageReceiver;

      if (event === INCOMING_EVENTS.RequestedEntities) {
        messageReceiverConstructor = createPostMessageReceiverForSelectedEntities;
      }
      await PactConsumer.given(description)
        .expectsToReceive(id)
        .withContent(payloadMatcher)
        .verify(messageReceiverConstructor(event, payload, expectations[id]));
    },
  );
});
