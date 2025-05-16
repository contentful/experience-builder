import { useEditorStore } from '@/store/editor';
import { EditorModeEntityStore, entityCacheStore } from '@contentful/experiences-core';

import { INTERNAL_EVENTS, VISUAL_EDITOR_EVENTS } from '@contentful/experiences-core/constants';
import { useEffect, useState } from 'react';
import { useStore } from 'zustand';

export const useInitializeEditor = () => {
  const initializeEditor = useEditorStore((state) => state.initializeEditor);

  const [initialized, setInitialized] = useState(false);
  const resetEntityStore = useStore(entityCacheStore, (state) => state.resetEntityStore);

  useEffect(() => {
    const onVisualEditorInitialize = (event) => {
      if (!event.detail) return;
      const { componentRegistry, designTokens, locale: initialLocale, entities } = event.detail;

      initializeEditor({
        initialLocale,
        componentRegistry,
        designTokens,
      });

      // if entities is set to [], then everything will still work as EntityStore will
      // request entities on demand via ▲REQUEST_ENTITY
      resetEntityStore(new EditorModeEntityStore({ locale: initialLocale, entities }));
      setInitialized(true);
    };

    // Listen for VisualEditorComponents internal event
    window.addEventListener(INTERNAL_EVENTS.VisualEditorInitialize, onVisualEditorInitialize);

    // Clean up the event listener
    return () => {
      window.removeEventListener(INTERNAL_EVENTS.VisualEditorInitialize, onVisualEditorInitialize);
    };
  }, [initializeEditor, resetEntityStore]);

  useEffect(() => {
    if (initialized) {
      return;
    }

    // Dispatch Visual Editor Ready event
    window.dispatchEvent(new CustomEvent(VISUAL_EDITOR_EVENTS.Ready));
  }, [initialized]);

  return initialized;
};
