import React, { useEffect } from 'react';
import {
  type InMemoryEntitiesStore,
  inMemoryEntitiesStore as defaultInMemoryEntitiesStore,
  EntityStore,
} from '@contentful/experiences-core';
import { RootRenderer } from './RootRenderer/RootRenderer';
import { useInitializeEditor } from '@/hooks/useInitializeEditor';
import type { Experience } from '@contentful/experiences-core/types';
import { useEditorStore } from '@/store/editor';

export const VisualEditorRoot = ({
  experience,
  inMemoryEntitiesStore = defaultInMemoryEntitiesStore,
}: {
  experience?: Experience<EntityStore>;
  inMemoryEntitiesStore?: InMemoryEntitiesStore;
}) => {
  const initialized = useInitializeEditor(inMemoryEntitiesStore);
  const setHyperLinkPattern = useEditorStore((state) => state.setHyperLinkPattern);

  useEffect(() => {
    if (experience?.hyperlinkPattern) {
      setHyperLinkPattern(experience.hyperlinkPattern);
    }
  }, [experience?.hyperlinkPattern, setHyperLinkPattern]);

  if (!initialized) return null;

  return <RootRenderer inMemoryEntitiesStore={inMemoryEntitiesStore} />;
};
