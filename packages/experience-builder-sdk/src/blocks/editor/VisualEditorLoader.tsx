import React, { useEffect, useState } from 'react';
import {
  type InMemoryEntitiesStore,
  type EntityStore,
  inMemoryEntitiesStore,
  VisualEditorMode,
} from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';
import type { StudioCanvasMode } from '@contentful/experiences-core/constants';

type VisualEditorLoaderProps = {
  visualEditorMode: VisualEditorMode;
  canvasMode?: StudioCanvasMode;
  experience?: Experience<EntityStore>;
};

export const VisualEditorLoader: React.FC<VisualEditorLoaderProps> = ({
  visualEditorMode,
  experience,
  canvasMode,
}) => {
  const [VisualEditor, setVisualEditor] = useState<React.ComponentType<{
    experience?: Experience<EntityStore>;
    inMemoryEntitiesStore?: InMemoryEntitiesStore;
    canvasMode?: StudioCanvasMode;
  }> | null>(null);

  useEffect(() => {
    // Dynamically import the visual editor based on the configured mode
    switch (visualEditorMode) {
      case VisualEditorMode.InjectScript:
        import('./VisualEditorInjectScript').then((module) => {
          setVisualEditor(() => module.default);
        });
        break;

      // VisualEditorMode.LazyLoad:
      default:
        import('@contentful/experiences-visual-editor-react').then((module) => {
          setVisualEditor(() => module.default);
        });
    }
  }, [visualEditorMode]);

  if (!VisualEditor) return null;

  return (
    <VisualEditor
      experience={experience}
      inMemoryEntitiesStore={inMemoryEntitiesStore}
      canvasMode={canvasMode}
    />
  );
};

export default VisualEditorLoader;
