import React from 'react';
import { InternalSDKMode } from '../types';
import { componentRegistry } from '../core/componentRegistry';
import VisualEditor from '@contentful/experience-builder-visual-editor';
import { VisualEditorContextProvider } from './editor/VisualEditorContext';

type VisualEditorRootProps = {
  initialLocale: string;
  mode: InternalSDKMode;
};

export const VisualEditorRoot: React.FC<VisualEditorRootProps> = ({ initialLocale, mode }) => {
  // in editor mode locale can change via sendMessage from web app, hence we use the locale from props only as initial locale
  return (
    <VisualEditorContextProvider mode={mode} initialLocale={initialLocale}>
      <VisualEditor
        mode={'editor'}
        initialLocale={initialLocale}
        initialComponentRegistry={componentRegistry}
      />
    </VisualEditorContextProvider>
  );
};

export default VisualEditorRoot;
