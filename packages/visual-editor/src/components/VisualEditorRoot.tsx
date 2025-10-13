import React, { useEffect } from 'react';
import {
  type InMemoryEntitiesStore,
  inMemoryEntitiesStore as defaultInMemoryEntitiesStore,
  EntityStore,
  type Experience,
} from '@contentful/experiences-core';
import type { StudioCanvasMode } from '@contentful/experiences-core/constants';
import { RootRenderer } from './RootRenderer/RootRenderer';
import { useInitializeEditor } from '@/hooks/useInitializeEditor';
import { useEditorStore } from '@/store/editor';

export const VisualEditorRoot = ({
  experience,
  inMemoryEntitiesStore = defaultInMemoryEntitiesStore,
  canvasMode,
}: {
  experience?: Experience<EntityStore>;
  inMemoryEntitiesStore?: InMemoryEntitiesStore;
  canvasMode?: StudioCanvasMode;
}) => {
  const initialized = useInitializeEditor(inMemoryEntitiesStore);
  const setHyperLinkPattern = useEditorStore((state) => state.setHyperLinkPattern);

  useEffect(() => {
    if (experience?.hyperlinkPattern) {
      setHyperLinkPattern(experience.hyperlinkPattern);
    }
  }, [experience?.hyperlinkPattern, setHyperLinkPattern]);

  if (!initialized) return null;

  return <RootRenderer inMemoryEntitiesStore={inMemoryEntitiesStore} canvasMode={canvasMode} />;
};
