import { MessageProviderPact } from '@pact-foundation/pact';
import path from 'path';

import { sendConnectedEventWithRegisteredComponents } from './core/componentRegistry';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import { defineBreakpoints, defineDesignTokens } from '@contentful/experiences-core';

const connectedMessageProvider = () => {
  let message;
  const postMessageSpy = jest.spyOn(window, 'postMessage').mockImplementation((msg) => {
    // We need to only intercept the OUTGOING_EVENTS.Connected event,
    // sendConnectedEventWithRegisteredComponents also sends OUTGOING_EVENTS.DesignTokens
    if (msg.eventType === OUTGOING_EVENTS.Connected) {
      message = msg;
    }
  });
  sendConnectedEventWithRegisteredComponents();
  postMessageSpy.mockRestore();

  return message;
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
  let message;
  const postMessageSpy = jest.spyOn(window, 'postMessage').mockImplementation((msg) => {
    if (msg.eventType === OUTGOING_EVENTS.DesignTokens) {
      message = msg;
    }
  });
  defineDesignTokens({
    colors: {
      primary: '#ff0000',
      secondary: '#00ff00',
    },
  });

  sendConnectedEventWithRegisteredComponents();

  postMessageSpy.mockRestore();

  return JSON.parse(JSON.stringify(message));
};

const breakpointsMessageProvider = () => {
  let message;
  const postMessageSpy = jest.spyOn(window, 'postMessage').mockImplementation((msg) => {
    if (msg.eventType === OUTGOING_EVENTS.RegisteredBreakpoints) {
      message = msg;
    }
  });
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

  postMessageSpy.mockRestore();

  return message;
};

describe('Pact Verification', () => {
  // 2 Pact setup
  const p = new MessageProviderPact({
    // For convinence we using the pacts folder that is created in user_interface. In reality pacts would be loaded from the pact broker (e.g. PactFlow)
    pactUrls: [path.resolve(process.cwd(), '../../../user_interface/pacts')],
    messageProviders: {
      [InteractionIds.ConnectedInterationId]: connectedMessageProvider,
      [InteractionIds.DesignTokensInterationId]: designTokensMessageProvider,
      [InteractionIds.RegisteredBreakpointsInteractionId]: breakpointsMessageProvider,
    },
    logLevel: 'debug',
    provider: 'ExperiencesSDKProvider',
    providerVersion: '1.3.0',
  });

  it('verifies the interactions', () => {
    return p.verify().then(() => {
      console.log('Pact Verification Complete!');
    });
  });
});
