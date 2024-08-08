'use client';
import { useEffect, useRef, useState } from 'react';
import {
  doesMismatchMessageSchema,
  sendMessage,
  tryParseMessage,
} from '@contentful/experiences-core';
import { INCOMING_EVENTS, OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import { sdkFeatures } from '../core/sdkFeatures';

type UseDetectEditorModeArgs = {
  /** If running from a known client side only situation (ie: useFetchBySlug),
   * set this to true to kick in editor mode check sooner (which avoids a render cycle) */
  isClientSide?: boolean;
};

export const useDetectEditorMode = ({ isClientSide = false }: UseDetectEditorModeArgs = {}) => {
  const [mounted, setMounted] = useState(false);
  const [isEditorMode, setIsEditorMode] = useState(isClientSide ? inIframe() : false);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(!!window.__EB__.isReadOnlyMode);
  const receivedMessage = useRef(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const missmatch = doesMismatchMessageSchema(event);

      if (missmatch) {
        return;
      }

      const eventData = tryParseMessage(event);

      if (eventData.eventType === INCOMING_EVENTS.RequestEditorMode) {
        setIsEditorMode(true);
        receivedMessage.current = true;
        if (typeof window !== 'undefined') {
          //Once we definitely know that we are in editor mode, we set this flag so future postMessage connect calls are not made
          if (!window.__EB__) {
            window.__EB__ = {};
          }
          window.__EB__.isEditorMode = true;
          // window.removeEventListener('message', onMessage);
        }
      }

      // @ts-expect-error skipping this for now
      if (eventData.eventType === INCOMING_EVENTS.RequestReadOnlyMode) {
        setIsEditorMode(true);
        setIsReadOnlyMode(true);
        //Once we definitely know that we are in editor mode, we set this flag so future postMessage connect calls are not made
        if (!window.__EB__) {
          window.__EB__ = {};
        }
        window.__EB__.isEditorMode = true;
        window.__EB__.isReadOnlyMode = true;
      }
    };

    //Only run check after component is mounted on the client to avoid hydration ssr issues
    if (mounted) {
      setIsEditorMode(inIframe());
      //Double check if we are in editor mode by listening to postMessage events
      if (typeof window !== 'undefined' && !window.__EB__?.isEditorMode) {
        window.addEventListener('message', onMessage);
        sendMessage(OUTGOING_EVENTS.Connected, undefined);
        sendMessage(OUTGOING_EVENTS.SDKFeatures, sdkFeatures);

        setTimeout(() => {
          if (!receivedMessage.current) {
            // if message is not received back in time, set editorMode back to false
            setIsEditorMode(false);
          }
        }, 100);
      }
    } else {
      setMounted(true);
    }

    return () => window.removeEventListener('message', onMessage);
  }, [mounted]);

  return { isEditorMode, isReadOnlyMode };
};

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return false;
  }
}
