import React, { useEffect } from 'react';
import { EntityStore } from '@contentful/experiences-core';
import { RootRenderer } from './RootRenderer/RootRenderer';
import { useInitializeEditor } from '@/hooks/useInitializeEditor';
import type { Experience } from '@contentful/experiences-core/types';
import { useEditorStore } from '@/store/editor';

export const VisualEditorRoot = ({ experience }: { experience?: Experience<EntityStore> }) => {
  const initialized = useInitializeEditor();
  const setHyperLinkPattern = useEditorStore((state) => state.setHyperLinkPattern);
  useEffect(() => {
    if (experience?.hyperlinkPattern) {
      setHyperLinkPattern(experience.hyperlinkPattern);
    }
  }, [experience?.hyperlinkPattern, setHyperLinkPattern]);

  if (!initialized) return null;

  return <RootRenderer />;
};
