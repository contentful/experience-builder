import { useEffect, useRef } from 'react';
import { InternalSDKMode } from '../types';
import { INCOMING_EVENTS, OUTGOING_EVENTS } from '../constants';
import { doesMismatchMessageSchema, tryParseMessage } from '../utils/validation';
import { sendMessage } from '../communication/sendMessage';

export const useEditorModeSwitch = ({
  mode,
  switchToEditorMode,
}: {
  mode: InternalSDKMode;
  switchToEditorMode: () => void;
}) => {
  const hasConnectEventBeenSent = useRef(false);

  // switch from preview mode to editor mode
  useEffect(() => {
    if (mode !== 'preview') {
      return;
    }

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
  }, [mode, switchToEditorMode]);
};
