import React, { useEffect, useState } from 'react';
import { InternalSDKMode, VisualEditorMode } from '../types';
import { VisualEditorContextProvider } from './editor/VisualEditorContext';

export type VisualEditorRootProps = {
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
    if (visualEditorMode === 'lazyLoad') {
      import('@contentful/experience-builder-visual-editor').then((module) => {
        setVisualEditor(() => module.default);
      });
    } else {
      import('./InjectVisualEditor').then((module) => {
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
