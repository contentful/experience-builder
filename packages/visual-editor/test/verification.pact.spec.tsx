import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { vitest } from 'vitest';
import { useEditorSubscriber } from '../src/hooks/useEditorSubscriber';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import { MessageProviderPact } from '@pact-foundation/pact';
import path from 'path';
import { VisualEditorRoot } from '../src/components/VisualEditorRoot';

import { EntityStore, defineBreakpoints, defineDesignTokens } from '@contentful/experiences-core';
import {
  sendConnectedEventWithRegisteredComponents,
  sendRegisteredComponentsMessage,
} from '@contentful/experiences-sdk-react/src/core/componentRegistry';
import { Experience, OutgoingEvent } from '@contentful/experiences-core/types';

const requestComponentTreeUpdateMessageProvider = () => {
  renderHook(() => useEditorSubscriber());
};

const connectedMessageProvider = () => {
  sendConnectedEventWithRegisteredComponents();
};

export enum InteractionIds {
  ConnectedInterationId = 'connected-event',
  DesignTokensInterationId = 'design-tokens-event',
  RegisteredBreakpointsInteractionId = 'registered-breakpoints-event',
  ComponentSelectedInteractionId = 'component-selected-event',
  MouseMoveInteractionId = 'mouse-move-event',
  NewHoveredElementInteractionId = 'new-hovered-element-event',
  AssemblyComponentSelectedInteractionId = 'assembly-component-selected-event',
  RegisteredComponentsInteractionId = 'registered-components-event',
  RequestComponentTreeUpdateInteractionId = 'request-component-tree-update-event',
  ComponentDragCanceledInteractionId = 'component-drag-canceled-event',
  ComponentDroppedInteractionId = 'component-dropped-event',
  ComponentMovedInteractionId = 'component-moved-event',
  CanvasReloadInteractionId = 'canvas-reload-event',
  CanvasScrollInteractionId = 'canvas-scroll-event',
  CanvasErrorInteractionId = 'canvas-error-event',
  UpdateSelectedComponentCoordinatesInteractionId = 'update-selected-component-coordinates-event',
  ComponentMoveStartedInteractionId = 'component-move-started-event',
  ComponentMoveEndedInteractionId = 'component-move-ended-event',
  OutsideCanvasClickInteractionId = 'outside-canvas-click-event',
  SDKFeaturesInteractionId = 'sdk-features-event',
  RequestEntitiesInteractionId = 'requested-entities-event',
}

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

const componentSelectedMessageProvider = () => {};
const assemblyComponentSelectedMessageProvider = () => {};
const componentsRegisteredMessageProvider = () => {
  sendRegisteredComponentsMessage();
};
const mouseMoveMessageProvider = () => {
  render(<VisualEditorRoot experience={vitest.fn() as Experience<EntityStore>} />);
};

const messageProviderWrapper = (messageProvider: () => any, eventType: OutgoingEvent) => {
  return () => {
    let message;
    const postMessageSpy = vitest.spyOn(window, 'postMessage').mockImplementation((msg) => {
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
  render(<VisualEditorRoot experience={vitest.fn() as Experience<EntityStore>} />);
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
