import { SendMessageParams, OutgoingMessage } from '@/types';

export const sendMessage: SendMessageParams = (eventType, data) => {
  if (typeof window === 'undefined') {
    return;
  }

  console.debug(`[experiences-sdk-react::sendMessage] Sending message [${eventType}]`, {
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
