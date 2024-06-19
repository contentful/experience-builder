import { OutgoingEvent } from '@/types';

export const sendMessage: OutgoingEvent = (eventType, data) => {
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
    },
    '*',
  );
};
