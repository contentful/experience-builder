import { MessageProviderPact } from '@pact-foundation/pact';
import path from 'path';

import { sendConnectedEventWithRegisteredComponents } from './core/componentRegistry';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';

const messageProvider = () => {
  let message;
  jest.spyOn(window, 'postMessage').mockImplementation((msg) => {
    // We need to only intercept the OUTGOING_EVENTS.Connected event, sendConnectedEventWithRegisteredComponents also sends OUTGOING_EVENTS.DesignTokens
    if (msg.eventType === OUTGOING_EVENTS.Connected) {
      message = msg;
    }
  });
  sendConnectedEventWithRegisteredComponents();

  return message;
};

// (2) Verify that the provider meets all consumer expectations
describe('Pact Verification', () => {
  // 2 Pact setup
  const p = new MessageProviderPact({
    // For convinence we using the pacts folder that is created in user_interface. In reality pacts would be loaded from the pact broker (e.g. PactFlow)
    pactUrls: [path.resolve(process.cwd(), '../../../user_interface/pacts')],
    messageProviders: {
      'a connected message': messageProvider,
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
