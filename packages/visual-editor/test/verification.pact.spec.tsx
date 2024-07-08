import React, { act } from 'react';
import { vi } from 'vitest';
import { cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { useEditorSubscriber } from '../src/hooks/useEditorSubscriber';
import { INCOMING_EVENTS, OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import { MessageProviderPact } from '@pact-foundation/pact';
import path from 'path';
import { VisualEditorRoot } from '../src/components/VisualEditorRoot';
import {
  EditorModeEntityStore,
  createExperience,
  defineBreakpoints,
  defineDesignTokens,
} from '@contentful/experiences-core';
import { addComponentRegistration } from '../src/store/registries';
import {
  sendConnectedEventWithRegisteredComponents,
  sendRegisteredComponentsMessage,
} from '@contentful/experiences-sdk-react/src/core/componentRegistry';
import { useDetectEditorMode } from '@contentful/experiences-sdk-react/src/hooks/useDetectEditorMode';
import { OutgoingEvent } from '@contentful/experiences-core/types';
import { RootRenderer } from '../src/components/RootRenderer/RootRenderer';
import { assets, componentRegistrations, entries, experienceEntry, tree } from './__fixtures__';
import { Entry } from 'contentful';
import { useTreeStore } from '../src/store/tree';
import { sendSelectedComponentCoordinates } from '../src/communication/sendSelectedComponentCoordinates';
import { DropResult } from '@hello-pangea/dnd';
import useCanvasInteractions from '../src/hooks/useCanvasInteractions';
import SimulateDnD from '../src/utils/simulateDnD';
import { ErrorBoundary } from '../../experience-builder-sdk/src/components/ErrorBoundary';

const PACT_PROVIDER = 'ExperiencesSDKProvider';

vi.mock(
  '../src/hooks/useInitializeEditor',
  vi.fn(() => ({ useInitializeEditor: () => true })),
);

const experience = createExperience({
  experienceEntry: experienceEntry as unknown as Entry,
  referencedAssets: [],
  referencedEntries: [],
  locale: 'en-US',
});

const InteractionIds = {
  ConnectedInterationId: 'connected-event',
  DesignTokensInterationId: 'design-tokens-event',
  RegisteredBreakpointsInteractionId: 'registered-breakpoints-event',
  ComponentSelectedInteractionId: 'component-selected-event',
  AssemblyComponentSelectedInteractionId: 'assembly-component-selected-event',
  MouseMoveInteractionId: 'mouse-move-event',
  NewHoveredElementInteractionId: 'new-hovered-element-event',
  RegisteredComponentsInteractionId: 'registered-components-event',
  RequestComponentTreeUpdateInteractionId: 'request-component-tree-update-event',
  ComponentDragCanceledInteractionId: 'component-drag-canceled-event',
  ComponentDroppedInteractionId: 'component-dropped-event',
  ComponentMovedInteractionId: 'component-moved-event',
  CanvasScrollInteractionId: 'canvas-scroll-event',
  CanvasErrorInteractionId: 'canvas-error-event',
  UpdateSelectedComponentCoordinatesInteractionId: 'update-selected-component-coordinates-event',
  OutsideCanvasClickInteractionId: 'outside-canvas-click-event',
  SDKFeaturesInteractionId: 'sdk-features-event',
  RequestEntitiesInteractionId: 'requested-entities-event',
};

// wrapper for each message provider, spies on the `window.postMessage` method for the specified event,
// intercepts and returns the message being sent
const messageProviderWrapper = (messageProvider: () => any, eventType: OutgoingEvent) => {
  return () => {
    let message;
    const postMessageSpy = vi.spyOn(window, 'postMessage').mockImplementation((msg) => {
      // We need to only intercept the OUTGOING_EVENTS.Connected event,
      // sendConnectedEventWithRegisteredComponents also sends OUTGOING_EVENTS.DesignTokens
      if (msg.eventType === eventType) {
        message = msg;
      }
    });

    messageProvider();

    postMessageSpy.mockRestore();

    // reset components rendered in the test
    cleanup();

    return message;
  };
};

const connectedMessageProvider = () => {
  sendConnectedEventWithRegisteredComponents();
};

const designTokensMessageProvider = () => {
  defineDesignTokens({
    colors: {
      primary: '#ff0000',
      secondary: '#00ff00',
    },
  });

  sendConnectedEventWithRegisteredComponents();
};

const breakpointsMessageProvider = () => {
  defineBreakpoints([
    {
      id: 'desktop',
      displayName: 'Desktop',
      query: '*',
      previewSize: '1024px',
      displayIcon: 'desktop',
    },
  ]);

  sendConnectedEventWithRegisteredComponents();
};

const componentSelectedMessageProvider = () => {
  renderEditorRoot();

  const el = screen.getByText('Block 1');
  fireEvent.click(el);
};

const assemblyComponentSelectedMessageProvider = () => {
  renderEditorRoot();

  const el = screen.getByText('Block 2');
  fireEvent.click(el);
  cleanup();
};

const mouseMoveMessageProvider = () => {
  renderEditorRoot();

  const el = screen.getByText('Block 1');
  SimulateDnD.updateIsDragging(true);
  fireEvent.mouseMove(el, { clientX: 100, clientY: 100 });
};

const newHoveredElementMessageProvider = () => {
  renderEditorRoot();

  const el = screen.getByText('Block 1');
  fireEvent.mouseOver(el);
};

const componentsRegisteredMessageProvider = () => {
  sendRegisteredComponentsMessage();
};

const requestComponentTreeUpdateMessageProvider = () => {
  renderHook(() => useEditorSubscriber());
};

const canvasScrollMessageProvider = () => {
  renderHook(() => useEditorSubscriber());
  window.dispatchEvent(new CustomEvent('scroll'));
};

const updateSelectedComponentCoordinatesMessageProvider = () => {
  renderEditorRoot();

  const el = screen.getByText('Block 1');
  fireEvent.click(el);
  sendSelectedComponentCoordinates(tree.root.children[0].data.id);
};

const outsideCanvasClickMessageProvider = () => {
  render(<RootRenderer />);
  fireEvent.click(document.body);
};

const sdkFeaturesMessageProvider = () => {
  renderHook(() => useDetectEditorMode());
  void window.dispatchEvent(
    new MessageEvent('message', {
      data: {
        eventType: INCOMING_EVENTS.RequestEditorMode,
        source: 'composability-app',
        origin: '',
      },
    }),
  );
};

const requestEntitiesMessageProvider = async () => {
  const store = new EditorModeEntityStore({ locale: 'en-US', entities: entries });
  const entryIds = entries.map((entry) => entry.sys.id);
  const assetIds = assets.map((asset) => asset.sys.id);

  store.fetchEntities({ missingEntryIds: entryIds, missingAssetIds: assetIds, skipCache: true });
};

const componentMovedMessageProvider = () => {
  const { result } = renderHook(() => useCanvasInteractions());
  const droppedItem: DropResult = {
    destination: {
      droppableId: 'root',
      index: 0,
    },
    draggableId: 'draggable',
    reason: 'DROP',
    mode: 'FLUID',
    combine: null,
    type: 'TYPE',
    source: {
      droppableId: 'root',
      index: 1,
    },
  };
  act(() => result.current.onMoveComponent(droppedItem));
};
const componentDroppedMessageProvider = () => {
  const { result } = renderHook(() => useCanvasInteractions());
  const droppedItem: DropResult = {
    destination: {
      droppableId: 'root',
      index: 0,
    },
    draggableId: 'draggable',
    reason: 'DROP',
    mode: 'FLUID',
    combine: null,
    type: 'TYPE',
    source: {
      droppableId: 'component-list',
      index: 1,
    },
  };
  act(() => result.current.onAddComponent(droppedItem));
};

const canvasErrorMessageProvider = () => {
  let message;
  const postMessageSpy = vi.spyOn(window, 'postMessage').mockImplementation((msg) => {
    if (msg.eventType === OUTGOING_EVENTS.CanvasError) {
      message = msg;
    }
  });

  const TestComponent = () => {
    throw new Error('Test error');
  };
  render(
    <ErrorBoundary>
      <TestComponent />
    </ErrorBoundary>,
  );

  // stringify error in order to be able to compare it via the pact payload matcher
  message.payload = JSON.parse(
    JSON.stringify(message.payload, Object.getOwnPropertyNames(message.payload)),
  );

  postMessageSpy.mockRestore();
  cleanup();

  return message;
};

describe('Pact Verification', () => {
  // 2 Pact setup
  const p = new MessageProviderPact({
    // For convinence we using the pacts folder that is created in user_interface. In reality pacts would be loaded from the pact broker (e.g. PactFlow)
    pactUrls: [
      path.resolve(
        process.cwd(),
        '../../../user_interface/pacts/UserInterfaceConsumer-ExperiencesSDKProvider.json',
      ),
    ],
    messageProviders: {
      [InteractionIds.ConnectedInterationId]: messageProviderWrapper(
        connectedMessageProvider,
        OUTGOING_EVENTS.Connected,
      ),
      [InteractionIds.DesignTokensInterationId]: messageProviderWrapper(
        designTokensMessageProvider,
        OUTGOING_EVENTS.DesignTokens,
      ),
      [InteractionIds.RegisteredBreakpointsInteractionId]: messageProviderWrapper(
        breakpointsMessageProvider,
        OUTGOING_EVENTS.RegisteredBreakpoints,
      ),
      [InteractionIds.ComponentSelectedInteractionId]: messageProviderWrapper(
        componentSelectedMessageProvider,
        OUTGOING_EVENTS.ComponentSelected,
      ),
      [InteractionIds.AssemblyComponentSelectedInteractionId]: messageProviderWrapper(
        assemblyComponentSelectedMessageProvider,
        OUTGOING_EVENTS.ComponentSelected,
      ),
      [InteractionIds.RequestComponentTreeUpdateInteractionId]: messageProviderWrapper(
        requestComponentTreeUpdateMessageProvider,
        OUTGOING_EVENTS.RequestComponentTreeUpdate,
      ),
      [InteractionIds.RegisteredComponentsInteractionId]: messageProviderWrapper(
        componentsRegisteredMessageProvider,
        OUTGOING_EVENTS.RegisteredComponents,
      ),
      [InteractionIds.MouseMoveInteractionId]: messageProviderWrapper(
        mouseMoveMessageProvider,
        OUTGOING_EVENTS.MouseMove,
      ),
      [InteractionIds.NewHoveredElementInteractionId]: messageProviderWrapper(
        newHoveredElementMessageProvider,
        OUTGOING_EVENTS.NewHoveredElement,
      ),
      [InteractionIds.ComponentDroppedInteractionId]: messageProviderWrapper(
        componentDroppedMessageProvider,
        OUTGOING_EVENTS.ComponentDropped,
      ),
      [InteractionIds.ComponentMovedInteractionId]: messageProviderWrapper(
        componentMovedMessageProvider,
        OUTGOING_EVENTS.ComponentMoved,
      ),
      [InteractionIds.CanvasScrollInteractionId]: messageProviderWrapper(
        canvasScrollMessageProvider,
        OUTGOING_EVENTS.CanvasScroll,
      ),
      [InteractionIds.CanvasErrorInteractionId]: canvasErrorMessageProvider,
      [InteractionIds.UpdateSelectedComponentCoordinatesInteractionId]: messageProviderWrapper(
        updateSelectedComponentCoordinatesMessageProvider,
        OUTGOING_EVENTS.UpdateSelectedComponentCoordinates,
      ),
      [InteractionIds.OutsideCanvasClickInteractionId]: messageProviderWrapper(
        outsideCanvasClickMessageProvider,
        OUTGOING_EVENTS.OutsideCanvasClick,
      ),
      [InteractionIds.SDKFeaturesInteractionId]: messageProviderWrapper(
        sdkFeaturesMessageProvider,
        OUTGOING_EVENTS.SDKFeatures,
      ),
      [InteractionIds.RequestEntitiesInteractionId]: messageProviderWrapper(
        requestEntitiesMessageProvider,
        OUTGOING_EVENTS.RequestEntities,
      ),
    },
    provider: PACT_PROVIDER,
    providerVersion: '1.3.0',
  });

  it('verifies the interactions', () => {
    return p.verify().then(() => {
      console.log('Pact Verification Complete!');
    });
  });
});

const renderEditorRoot = () => {
  addComponentRegistration(componentRegistrations[0]);
  addComponentRegistration(componentRegistrations[1]);

  const { result } = renderHook(() =>
    useTreeStore((state) => ({
      updateTree: state.updateTree,
    })),
  );
  act(() => result.current.updateTree(tree));

  render(<VisualEditorRoot experience={experience} />);
};
