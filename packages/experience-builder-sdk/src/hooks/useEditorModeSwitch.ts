import { useEffect, useRef } from 'react';
import {
  doesMismatchMessageSchema,
  sendMessage,
  tryParseMessage,
} from '@contentful/experience-builder-core';
import { INCOMING_EVENTS, OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';

export const useEditorModeSwitch = ({ switchToEditorMode }: { switchToEditorMode: () => void }) => {
  const hasConnectEventBeenSent = useRef(false);

  // switch to editor mode
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (doesMismatchMessageSchema(event)) {
        return;
      }
      const eventData = tryParseMessage(event);

      if (eventData.eventType === INCOMING_EVENTS.RequestEditorMode) {
        switchToEditorMode();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', onMessage);

      if (!hasConnectEventBeenSent.current) {
        sendMessage(OUTGOING_EVENTS.Connected);
        hasConnectEventBeenSent.current = true;
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', onMessage);
      }
    };
  }, [switchToEditorMode]);
};
