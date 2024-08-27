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
  StudioExperienceMode,
} from '@contentful/experiences-core/constants';
import { sdkFeatures } from '../core/sdkFeatures';

type UseDetectModeArgs = {
  /** If running from a known client side only situation (ie: useFetchBySlug),
   * set this to true to kick in editor mode check sooner (which avoids a render cycle) */
  isClientSide?: boolean;
};

export const useDetectMode = ({ isClientSide = false }: UseDetectModeArgs = {}) => {
  const [mounted, setMounted] = useState(false);
  const recievedModeMessage = useRef(false);
  const [mode, setMode] = useState<StudioExperienceMode>(() => {
    // if we are client side and running in an iframe, then initialize to read only,
    // Editor mode can be requested later.
    if (isClientSide && inIframe()) {
      return StudioExperienceMode.READ_ONLY;
    } else {
      return StudioExperienceMode.NONE;
    }
  });

  const onMessage = useCallback((event: MessageEvent) => {
    if (doesMismatchMessageSchema(event)) {
      return;
    }
    const eventData = tryParseMessage(event);

    console.log('[ <useDetectMode()> ] onMessage() event => ', event);

    if (eventData.eventType === INCOMING_EVENTS.RequestEditorMode) {
      setMode(StudioExperienceMode.EDITOR);
      recievedModeMessage.current = true;
      if (typeof window !== 'undefined') {
        // Once we definitely know that we are in editor mode, we set this flag so future postMessage connect calls are not made
        if (!window.__EB__) {
          window.__EB__ = {};
        }
        window.__EB__.isReadOnlyMode = false;
        window.__EB__.isEditorMode = true;
      }
    } else if (eventData.eventType === INCOMING_EVENTS.RequestReadOnlyMode) {
      console.log(
        '############ YESSSSSSSSSSSSSS!!!!!! ########### [ SDK ] useDetectMode() eventData.eventType => ',
        eventData.eventType,
      );

      setMode(StudioExperienceMode.READ_ONLY);
      recievedModeMessage.current = true;
      if (typeof window !== 'undefined') {
        // Once we definitely know that we are in read only mode, we set this flag so future postMessage connect calls are not made
        if (!window.__EB__) {
          window.__EB__ = {};
        }
        window.__EB__.isEditorMode = false;
        window.__EB__.isReadOnlyMode = true;
      }
    }

    if (recievedModeMessage.current === true) {
      console.log(
        'recieved instructions for read-only or editor mode, removing listener; recievedModeMessage => ',
        recievedModeMessage.current,
      );

      window.removeEventListener('message', onMessage);
    }
  }, []);

  useEffect(() => {
    // Only run check after component is mounted on the client to avoid hydration ssr issues
    if (mounted) {
      // Double check if we are in editor mode by listening to postMessage events
      if (typeof window !== 'undefined') {
        window.addEventListener('message', onMessage);
        sendMessage(OUTGOING_EVENTS.Connected, undefined);
        sendMessage(OUTGOING_EVENTS.SDKFeatures, sdkFeatures);

        setTimeout(() => {
          if (recievedModeMessage.current === false) {
            console.log(' {{{{{{ FAILURE }}}}}} ');
            console.log(
              '[ useDetectMode() ] setTimeout() Have not recieved read-only or editor mode instructions.  defaulting to NONE => ',
              'recievedModeMessage.current => ',
              recievedModeMessage.current,
            );

            // if message is not received back in time, set mode back to none
            setMode(StudioExperienceMode.NONE);
          } else {
            console.log(' {{{{{{{ SUCCESS! }}}}}}} ');
            console.log(
              'I HAVE RECIEVED EITHER EDITOR OR READ ONLY INSTURCTIONS!!!!! SUCCESS!!!!!',
              'recievedModeMessage.current => ',
              recievedModeMessage.current,
            );
          }
        }, 100);
      }
    } else {
      setMounted(true);
    }

    return () => window.removeEventListener('message', onMessage);
  }, [mounted]);

  return mode;
};

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return false;
  }
}
