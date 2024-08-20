import React, { useEffect, useState } from 'react';
import { EntityStore, VisualEditorMode } from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';

type VisualEditorLoaderProps = {
  visualEditorMode: VisualEditorMode;
  experience?: Experience<EntityStore>;
  metadata?: Record<string, any>;
};

export const VisualEditorLoader: React.FC<VisualEditorLoaderProps> = ({
  visualEditorMode,
  metadata,
  experience,
}) => {
  const [VisualEditor, setVisualEditor] = useState<React.ComponentType<{
    experience?: Experience<EntityStore>;
    metadata: Record<string, unknown>;
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

  return <VisualEditor metadata={metadata ?? {}} experience={experience} />;
};

export default VisualEditorLoader;
