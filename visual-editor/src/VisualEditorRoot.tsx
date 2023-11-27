import React from 'react';
import { VisualEditorContextProvider } from '@components/editor/VisualEditorContext';
import { ComponentRegistration, CompositionTree, InternalSDKMode } from './types';
import VisualEditor from './VisualEditor';

export type VisualEditorRootProps = {
  initialLocale: string;
  initialTree?: CompositionTree;
  initialComponentRegistry: Map<string, ComponentRegistration>;
  mode: InternalSDKMode;
};

export const VisualEditorRoot = ({
  initialLocale,
  mode,
  initialTree,
  initialComponentRegistry,
}: VisualEditorRootProps) => {
  // in editor mode locale can change via sendMessage from web app, hence we use the locale from props only as initial locale
  return (
    <VisualEditorContextProvider
      initialComponentRegistry={initialComponentRegistry}
      initialTree={initialTree}
      mode={mode}
      initialLocale={initialLocale}>
      <VisualEditor />
    </VisualEditorContextProvider>
  );
};
