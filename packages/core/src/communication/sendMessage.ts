import { SendMessageParams, OutgoingMessage } from '@/types';
import { debug } from '@/utils';

export const sendMessage: SendMessageParams = (eventType, data) => {
  if (typeof window === 'undefined') {
    return;
  }

  debug.debug(`[experiences-sdk-react::sendMessage] Sending message [${eventType}]`, {
    source: 'customer-app',
    eventType,
    payload: data,
  });

  window.parent?.postMessage(
    {
      source: 'customer-app',
      eventType,
      payload: data,
    } as OutgoingMessage,
    '*',
  );
};
