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
      const {
        componentRegistry,
        designTokens,
        locale: initialLocale,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        entities,
      } = event.detail;

      initializeEditor({
        initialLocale,
        componentRegistry,
        designTokens,
      });

      // TODO-AFTER-PR-APPROVAL:
      // Here we temporarily disable "prefetching of entities"
      // to force VisualEditor to start from an empty EntityStore
      // so that we can exercise on-demand-entity-fetching mechanism (via REQUEST_ENTITIES message)
      resetEntityStore(initialLocale, []);
      // resetEntityStore(initialLocale, entities);
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
