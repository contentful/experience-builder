import { useEffect, useRef, useState } from 'react';
import { EntityStore } from '@contentful/visual-sdk';
import {
  componentRegistry,
  sendConnectedEventWithRegisteredComponents,
  sendRegisteredComponentsMessage,
} from '../core/componentRegistry';
import {
  INTERNAL_EVENTS,
  VISUAL_EDITOR_EVENTS,
} from '@contentful/experience-builder-core/constants';
import { designTokensRegistry } from '@contentful/experience-builder-core';

type InitializeVisualEditorParams = {
  initialLocale: string;
  initialEntities?: EntityStore['entities'];
};

export const useInitializeVisualEditor = (params: InitializeVisualEditorParams) => {
  const { initialLocale, initialEntities } = params;
  const [locale, setLocale] = useState<string>(initialLocale);

  const hasConnectEventBeenSent = useRef(false);

  // sends component definitions to the web app
  // InternalEvents.COMPONENTS_REGISTERED is triggered by defineComponents function
  useEffect(() => {
    if (!hasConnectEventBeenSent.current) {
      // sending CONNECT but with the registered components now
      sendConnectedEventWithRegisteredComponents();
      hasConnectEventBeenSent.current = true;
    }

    const onComponentsRegistered = () => {
      sendRegisteredComponentsMessage();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(INTERNAL_EVENTS.ComponentsRegistered, onComponentsRegistered);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(INTERNAL_EVENTS.ComponentsRegistered, onComponentsRegistered);
      }
    };
  }, []);

  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  useEffect(() => {
    const onVisualEditorReady = () => {
      window.dispatchEvent(
        new CustomEvent(INTERNAL_EVENTS.VisualEditorInitialize, {
          detail: {
            componentRegistry,
            designTokens: designTokensRegistry,
            locale,
            entities: initialEntities ?? [],
          },
        })
      );
    };

    window.addEventListener(VISUAL_EDITOR_EVENTS.Ready, onVisualEditorReady);
    return () => {
      window.removeEventListener(VISUAL_EDITOR_EVENTS.Ready, onVisualEditorReady);
    };
  }, [locale, initialEntities]);
};
