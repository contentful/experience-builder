import { MessageProviderPact } from '@pact-foundation/pact';
import path from 'path';

import { sendConnectedEventWithRegisteredComponents } from './core/componentRegistry';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';

const messageProvider = () => {
  let message;
  jest.spyOn(window, 'postMessage').mockImplementation((msg) => {
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
    pactUrls: [path.resolve(process.cwd(), '../../../user_interface/pacts')],
    messageProviders: {
      'a connected message': messageProvider,
    },
    logLevel: 'debug',
    provider: 'ExperiencesSDKProvider',
    providerVersion: '1.0.0',
  });

  it('verifies the interactions', () => {
    return p.verify().then(() => {
      console.log('Pact Verification Complete!');
    });
  });
});
