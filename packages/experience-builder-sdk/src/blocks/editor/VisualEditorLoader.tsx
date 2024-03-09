import React, { useEffect, useState } from 'react';
import { VisualEditorMode } from '@contentful/experiences-core';

type VisualEditorLoaderProps = {
  visualEditorMode: VisualEditorMode;
};

export const VisualEditorLoader: React.FC<VisualEditorLoaderProps> = ({ visualEditorMode }) => {
  const [VisualEditor, setVisualEditor] = useState<React.ComponentType | null>(null);

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

  return <VisualEditor />;
};

export default VisualEditorLoader;
