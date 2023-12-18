import React, { useEffect, useState } from 'react';
import type { InternalSDKMode } from '@contentful/experience-builder-core/types';
import { VisualEditorContextProvider } from './editor/VisualEditorContext';
import { VisualEditorMode } from '@contentful/experience-builder-core';

type VisualEditorRootProps = {
  initialLocale: string;
  mode: InternalSDKMode;
  visualEditorMode: VisualEditorMode;
};

export const VisualEditorRoot: React.FC<VisualEditorRootProps> = ({
  initialLocale,
  mode,
  visualEditorMode,
}) => {
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
        import('@contentful/experience-builder-visual-editor').then((module) => {
          setVisualEditor(() => module.default);
        });
    }
  }, [visualEditorMode]);

  if (!VisualEditor) return null;

  return (
    <VisualEditorContextProvider mode={mode} initialLocale={initialLocale}>
      <VisualEditor />
    </VisualEditorContextProvider>
  );
};

export default VisualEditorRoot;
