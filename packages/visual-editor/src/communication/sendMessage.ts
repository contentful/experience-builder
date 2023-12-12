import { PostMessageMethods } from '@contentful/visual-sdk';

import { OutgoingEvent } from '@contentful/experience-builder-core';

export const sendMessage = (eventType: OutgoingEvent | PostMessageMethods, data?: any) => {
  if (typeof window === 'undefined') {
    return;
  }

  console.debug('data sent', {
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
    '*'
  );
};
