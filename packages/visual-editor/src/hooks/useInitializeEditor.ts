import { useEditorStore } from '@/store/editor';
import { useEntityStore } from '@/store/entityStore';

import {
  INTERNAL_EVENTS,
  VISUAL_EDITOR_EVENTS,
} from '@contentful/experience-builder-core/constants';
import { useEffect, useState } from 'react';

export const useInitializeEditor = () => {
  const initializeEditor = useEditorStore((state) => state.initializeEditor);
  const [initialized, setInitialized] = useState(false);
  const resetEntityStore = useEntityStore((state) => state.resetEntityStore);

  useEffect(() => {
    const onVisualEditorInitialize = (event) => {
      if (!event.detail) return;
      const { componentRegistry, locale: initialLocale, entities } = event.detail;

      initializeEditor({
        initialLocale,
        componentRegistry,
      });

      resetEntityStore(initialLocale, entities);
      setInitialized(true);
    };

    // Listen for VisualEditorComponents internal event
    window.addEventListener(INTERNAL_EVENTS.VisualEditorInitialize, onVisualEditorInitialize);

    // Clean up the event listener
    return () => {
      window.removeEventListener(INTERNAL_EVENTS.VisualEditorInitialize, onVisualEditorInitialize);
    };
  }, []);

  useEffect(() => {
    if (initialized) {
      return;
    }

    // Dispatch Visual Editor Ready event
    window.dispatchEvent(new CustomEvent(VISUAL_EDITOR_EVENTS.Ready));
  }, []);

  return initialized;
};
