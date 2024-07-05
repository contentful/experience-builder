import React, { act } from 'react';
import { cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useEditorSubscriber } from '../src/hooks/useEditorSubscriber';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import { MessageProviderPact } from '@pact-foundation/pact';
import path from 'path';
import { VisualEditorRoot } from '../src/components/VisualEditorRoot';

import {
  EntityStore,
  createExperience,
  defineBreakpoints,
  defineDesignTokens,
} from '@contentful/experiences-core';
import { addComponentRegistration } from '../src/store/registries';
import {
  sendConnectedEventWithRegisteredComponents,
  sendRegisteredComponentsMessage,
} from '@contentful/experiences-sdk-react/src/core/componentRegistry';
import { Experience, OutgoingEvent } from '@contentful/experiences-core/types';
import { RootRenderer } from '../src/components/RootRenderer/RootRenderer';
import { componentRegistrations, experienceEntry, tree } from './__fixtures__';
import { Entry } from 'contentful';
import { useTreeStore } from '../src/store/tree';

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
  MouseMoveInteractionId: 'mouse-move-event',
  NewHoveredElementInteractionId: 'new-hovered-element-event',
  AssemblyComponentSelectedInteractionId: 'assembly-component-selected-event',
  RegisteredComponentsInteractionId: 'registered-components-event',
  RequestComponentTreeUpdateInteractionId: 'request-component-tree-update-event',
  ComponentDragCanceledInteractionId: 'component-drag-canceled-event',
  ComponentDroppedInteractionId: 'component-dropped-event',
  ComponentMovedInteractionId: 'component-moved-event',
  CanvasReloadInteractionId: 'canvas-reload-event',
  CanvasScrollInteractionId: 'canvas-scroll-event',
  CanvasErrorInteractionId: 'canvas-error-event',
  UpdateSelectedComponentCoordinatesInteractionId: 'update-selected-component-coordinates-event',
  ComponentMoveStartedInteractionId: 'component-move-started-event',
  ComponentMoveEndedInteractionId: 'component-move-ended-event',
  OutsideCanvasClickInteractionId: 'outside-canvas-click-event',
  SDKFeaturesInteractionId: 'sdk-features-event',
  RequestEntitiesInteractionId: 'requested-entities-event',
};

const requestComponentTreeUpdateMessageProvider = () => {
  renderHook(() => useEditorSubscriber());
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

const componentsRegisteredMessageProvider = () => {
  sendRegisteredComponentsMessage();
};
const mouseMoveMessageProvider = () => {
  render(<VisualEditorRoot experience={vi.fn() as Experience<EntityStore>} />);
};

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

    return message;
  };
};

const newHoveredElementMessageProvider = () => {
  render(<VisualEditorRoot experience={vi.fn() as Experience<EntityStore>} />);
};

const outsideCanvasClickMessageProvider = () => {
  render(<RootRenderer />);
  fireEvent.click(document.body);
};

const componentMoveStartedMessageProvider = () => {
  render(<RootRenderer />);
  fireEvent.mouseDown(document.body);
};

const componentMoveEndedMessageProvider = () => {
  // render(<DNDProvider isTestRunOverride={true}>{ }</DNDProvider>);
  // const testContainer = document.querySelector('[data-test-id="dnd-context-substitute"]');
  // testContainer && fireEvent.mouseDown(testContainer);
  // testContainer && fireEvent.mouseMove(testContainer, { clientX: 100, clientY: 100 });
  // const event = new CustomEvent('dragStart');
  // testContainer && testContainer.dispatchEvent(event);
  // console.log('div: ', testContainer);
  // // if (div) {
  // //   fireEvent.mouseDown(div);
  // // }
  // screen.debug();
};

const componentSelectedMessageProvider = () => {
  addComponentRegistration(componentRegistrations[0]);
  addComponentRegistration(componentRegistrations[1]);

  const { result } = renderHook(() =>
    useTreeStore((state) => ({
      updateTree: state.updateTree,
    })),
  );
  act(() => result.current.updateTree(tree));

  render(<VisualEditorRoot experience={experience} />);
  const el = screen.getByText('Block 1');
  fireEvent.click(el);
  cleanup();
};
const assemblyComponentSelectedMessageProvider = () => {
  addComponentRegistration(componentRegistrations[0]);
  addComponentRegistration(componentRegistrations[1]);

  const { result } = renderHook(() =>
    useTreeStore((state) => ({
      updateTree: state.updateTree,
    })),
  );
  act(() => result.current.updateTree(tree));

  render(<VisualEditorRoot experience={experience} />);
  const el = screen.getByText('Block 2');
  fireEvent.click(el);
  cleanup();
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
      [InteractionIds.ComponentDragCanceledInteractionId]: messageProviderWrapper(
        () => {},
        OUTGOING_EVENTS.ComponentDragCanceled,
      ),
      [InteractionIds.ComponentDroppedInteractionId]: messageProviderWrapper(
        () => {},
        OUTGOING_EVENTS.ComponentDropped,
      ),
      [InteractionIds.ComponentMovedInteractionId]: messageProviderWrapper(
        () => {},
        OUTGOING_EVENTS.ComponentMoved,
      ),
      [InteractionIds.CanvasReloadInteractionId]: messageProviderWrapper(
        () => {},
        OUTGOING_EVENTS.CanvasReload,
      ),
      [InteractionIds.CanvasScrollInteractionId]: messageProviderWrapper(
        () => {},
        OUTGOING_EVENTS.CanvasScroll,
      ),
      [InteractionIds.CanvasErrorInteractionId]: messageProviderWrapper(
        () => {},
        OUTGOING_EVENTS.CanvasError,
      ),
      [InteractionIds.UpdateSelectedComponentCoordinatesInteractionId]: messageProviderWrapper(
        () => {},
        OUTGOING_EVENTS.UpdateSelectedComponentCoordinates,
      ),
      [InteractionIds.ComponentMoveStartedInteractionId]: messageProviderWrapper(
        componentMoveStartedMessageProvider,
        OUTGOING_EVENTS.ComponentMoveStarted,
      ),
      [InteractionIds.ComponentMoveEndedInteractionId]: messageProviderWrapper(
        componentMoveEndedMessageProvider,
        OUTGOING_EVENTS.ComponentMoveEnded,
      ),
      [InteractionIds.OutsideCanvasClickInteractionId]: messageProviderWrapper(
        outsideCanvasClickMessageProvider,
        OUTGOING_EVENTS.OutsideCanvasClick,
      ),
      [InteractionIds.SDKFeaturesInteractionId]: messageProviderWrapper(
        () => {},
        OUTGOING_EVENTS.SDKFeatures,
      ),
      [InteractionIds.RequestEntitiesInteractionId]: messageProviderWrapper(
        () => {},
        OUTGOING_EVENTS.RequestEntities,
      ),
    },
    //logLevel: 'debug',
    provider: 'ExperiencesSDKProvider',
    providerVersion: '1.3.0',
  });

  it('verifies the interactions', () => {
    return p.verify().then(() => {
      console.log('Pact Verification Complete!');
    });
  });
});
