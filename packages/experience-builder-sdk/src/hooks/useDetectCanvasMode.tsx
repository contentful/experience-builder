'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  doesMismatchMessageSchema,
  sendMessage,
  tryParseMessage,
} from '@contentful/experiences-core';
import {
  INCOMING_EVENTS,
  OUTGOING_EVENTS,
  StudioCanvasMode,
} from '@contentful/experiences-core/constants';
import { sdkFeatures } from '../core/sdkFeatures';

type useDetectCanvasModeArgs = {
  /** If running from a known client side only situation (ie: useFetchBySlug),
   * set this to true to kick in editor mode check sooner (which avoids a render cycle) */
  isClientSide?: boolean;
};

export const useDetectCanvasMode = ({ isClientSide = false }: useDetectCanvasModeArgs = {}) => {
  const [mounted, setMounted] = useState(false);
  const receivedModeMessage = useRef(false);
  const [mode, setMode] = useState<StudioCanvasMode>(() => {
    // if we are client side and running in an iframe, then initialize to read only,
    // Editor mode can be requested later.
    if (isClientSide && inIframe()) {
      return StudioCanvasMode.READ_ONLY;
    } else {
      return StudioCanvasMode.NONE;
    }
  });

  const onMessage = useCallback((event: MessageEvent) => {
    if (doesMismatchMessageSchema(event)) {
      return;
    }
    const eventData = tryParseMessage(event);
    const isRequestingCanvasMode =
      eventData.eventType === INCOMING_EVENTS.RequestEditorMode ||
      eventData.eventType === INCOMING_EVENTS.RequestReadOnlyMode;

    if (!isRequestingCanvasMode) {
      return;
    }

    const isEditorMode = eventData.eventType === INCOMING_EVENTS.RequestEditorMode;
    const mode = isEditorMode ? StudioCanvasMode.EDITOR : StudioCanvasMode.READ_ONLY;

    receivedModeMessage.current = true;
    setMode(mode);

    if (typeof window !== 'undefined') {
      // Once we definitely know that we are in editor mode, we set this flag so future postMessage connect calls are not made
      if (!window.__EB__) {
        window.__EB__ = {};
      }
      window.__EB__.isReadOnlyMode = !isEditorMode;
      window.__EB__.isEditorMode = isEditorMode;
    }

    window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    const handleHandshakeTimeout = () => {
      if (!receivedModeMessage.current) {
        setMode(StudioCanvasMode.NONE);
      }
    };

    // Only run check after component is mounted on the client to avoid hydration ssr issues
    if (mounted) {
      // Double check if we are in editor mode by listening to postMessage events
      if (typeof window !== 'undefined') {
        window.addEventListener('message', onMessage);
        sendMessage(OUTGOING_EVENTS.Connected, undefined);
        sendMessage(OUTGOING_EVENTS.SDKFeatures, sdkFeatures);

        // FIXME: This causes a race condition by setting the mode sometimes to NONE when
        // reloading the canvas due to a save event.
        const handshakeTimeout = setTimeout(handleHandshakeTimeout, 100);

        return () => {
          window.removeEventListener('message', onMessage);
          clearTimeout(handshakeTimeout);
        };
      }
    } else {
      setMounted(true);
    }
  }, [mode, mounted, onMessage]);

  return mode;
};

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return false;
  }
}
