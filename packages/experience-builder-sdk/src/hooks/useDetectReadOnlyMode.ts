'use client';
import { useEffect, useRef, useState } from 'react';
import {
  doesMismatchMessageSchema,
  sendMessage,
  tryParseMessage,
} from '@contentful/experiences-core';
import { INCOMING_EVENTS, OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import { sdkFeatures } from '../core/sdkFeatures';

export const useDetectReadOnlyMode = () => {
  const [mounted, setMounted] = useState(false);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);
  const [experienceId, setExperienceId] = useState<string | null>(null);
  const receivedMessage = useRef(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (doesMismatchMessageSchema(event)) {
        return;
      }
      const eventData = tryParseMessage(event);

      if (eventData.eventType === INCOMING_EVENTS.RequestReadOnlyMode) {
        console.log(
          '[ useDetectReadOnlyMode() ] "woohoo req read-only mode" eventData => ',
          eventData,
        );

        setIsReadOnlyMode(true);
        // @ts-ignore
        setExperienceId(eventData?.payload?.experienceId);
        receivedMessage.current = true;
        if (typeof window !== 'undefined') {
          //Once we definitely know that we are in editor mode, we set this flag so future postMessage connect calls are not made
          if (!window.__EB__) {
            window.__EB__ = {};
          }
          window.__EB__.isReadOnlyMode = true;
          window.removeEventListener('message', onMessage);
        }
      }
    };

    //Only run check after component is mounted on the client to avoid hydration ssr issues
    if (mounted) {
      // setIsReadOnlyMode(inIframe());
      //Double check if we are in read only mode by listening to postMessage events
      if (typeof window !== 'undefined' && !window.__EB__?.isReadOnlyMode) {
        window.addEventListener('message', onMessage);
        sendMessage(OUTGOING_EVENTS.Connected, undefined);
        sendMessage(OUTGOING_EVENTS.SDKFeatures, sdkFeatures);
        sendMessage(OUTGOING_EVENTS.RequestReadOnlyExperience, undefined);

        setTimeout(() => {
          if (!receivedMessage.current) {
            // if message is not received back in time, set read only mode back to false
            setIsReadOnlyMode(false);
          }
        }, 100);
      }
    } else {
      setMounted(true);
    }

    return () => window.removeEventListener('message', onMessage);
  }, [mounted]);

  return isReadOnlyMode;
};

// function inIframe() {
//   try {
//     return window.self !== window.top;
//   } catch (e) {
//     return false;
//   }
// }
