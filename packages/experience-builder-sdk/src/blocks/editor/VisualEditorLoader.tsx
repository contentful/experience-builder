import React, { useEffect, useState } from 'react';
import axe from 'axe-core';
import { EntityStore, VisualEditorMode } from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';

type VisualEditorLoaderProps = {
  visualEditorMode: VisualEditorMode;
  experience?: Experience<EntityStore>;
};

export const VisualEditorLoader: React.FC<VisualEditorLoaderProps> = ({
  visualEditorMode,

  experience,
}) => {
  const [VisualEditor, setVisualEditor] = useState<React.ComponentType<{
    experience?: Experience<EntityStore>;
  }> | null>(null);

  useEffect(() => {
    console.log('- VisualEditorRoot:: Configuring axe');
    axe.configure({ allowedOrigins: ['<unsafe_all_origins>'] });
  }, []);

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

  return <VisualEditor experience={experience} />;
};

export default VisualEditorLoader;
