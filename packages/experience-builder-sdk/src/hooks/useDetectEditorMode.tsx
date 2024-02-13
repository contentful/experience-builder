import { useEffect, useRef, useState } from 'react';
import {
  doesMismatchMessageSchema,
  sendMessage,
  tryParseMessage,
} from '@contentful/experience-builder-core';
import { INCOMING_EVENTS, OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';

export const useDetectEditorMode = () => {
  //Assume we are in editor mode initially if we are in iframe
  const [isEditorMode, setIsEditorMode] = useState(inIframe());
  const receivedMessage = useRef(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (doesMismatchMessageSchema(event)) {
        return;
      }
      const eventData = tryParseMessage(event);

      if (eventData.eventType === INCOMING_EVENTS.RequestEditorMode) {
        setIsEditorMode(true);
        receivedMessage.current = true;
        if (typeof window !== 'undefined') {
          //Once we definitely know that we are in editor mode, we set this flag so future postMessage connect calls are not made
          window.__EB__.isEditorMode = true;
          window.removeEventListener('message', onMessage);
        }
      }
    };

    //Double check if we are in editor mode by listening to postMessage events
    if (typeof window !== 'undefined' && !window.__EB__?.isEditorMode) {
      window.addEventListener('message', onMessage);
      sendMessage(OUTGOING_EVENTS.Connected);

      setTimeout(() => {
        if (!receivedMessage.current) {
          // if message is not received back in time, set editorMode back to false
          setIsEditorMode(false);
        }
      }, 100);
    }
    return () => window.removeEventListener('message', onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isEditorMode;
};

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return false;
  }
}
