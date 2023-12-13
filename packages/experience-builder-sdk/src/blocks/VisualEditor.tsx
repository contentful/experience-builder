import React, { useEffect, useState } from 'react';
import { InternalSDKMode, VisualEditorMode } from '../types';
import { VisualEditorContextProvider } from './editor/VisualEditorContext';
import { visualEditorMode } from '../core/visualEditorSettings';

export type VisualEditorRootProps = {
  initialLocale: string;
  mode: InternalSDKMode;
};

export const VisualEditorRoot: React.FC<VisualEditorRootProps> = ({ initialLocale, mode }) => {
  const [VisualEditor, setVisualEditor] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (visualEditorMode === VisualEditorMode.LazyLoad) {
      import('@contentful/experience-builder-visual-editor').then((module) => {
        setVisualEditor(() => module.default);
      });
    } else {
      import('./InjectVisualEditor').then((module) => {
        setVisualEditor(() => module.default);
      });
    }
  }, []);

  if (!VisualEditor) return null;

  return (
    <VisualEditorContextProvider mode={mode} initialLocale={initialLocale}>
      <VisualEditor />
    </VisualEditorContextProvider>
  );
};

export default VisualEditorRoot;
