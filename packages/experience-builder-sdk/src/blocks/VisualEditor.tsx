import React from 'react';
import { ComponentRegistration, InternalSDKMode } from '../types';
import { VisualEditorContextProvider } from './editor/VisualEditorContext';
import { componentRegistry } from '../core/componentRegistry';

const VisualEditor = React.lazy(async () => {
  const { VisualEditor } = await import('@contentful/experience-builder-visual-editor');
  return { default: VisualEditor };
});

type VisualEditorRootProps = {
  initialLocale: string;
  mode: InternalSDKMode;
};

export const VisualEditorRoot = ({ initialLocale, mode }: VisualEditorRootProps) => {
  const components: ComponentRegistration[] = [];

  componentRegistry.forEach((comp) => {
    components.push(comp);
  });
  // in editor mode locale can change via sendMessage from web app, hence we use the locale from props only as initial locale
  return (
    <VisualEditorContextProvider mode={mode} initialLocale={initialLocale}>
      <VisualEditor components={components} />
    </VisualEditorContextProvider>
  );
};

export default VisualEditorRoot;
