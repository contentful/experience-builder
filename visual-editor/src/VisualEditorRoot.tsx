import React from 'react';
import { VisualEditorContextProvider } from '@components/editor/VisualEditorContext';
import { ComponentRegistration, InternalSDKMode } from '@contentful/experience-builder-core';
import VisualEditor from './VisualEditor';
import { Provider } from 'react-redux';
import { store } from './redux/store';

export type VisualEditorRootProps = {
  initialLocale: string;
  initialComponentRegistry: Map<string, ComponentRegistration>;
  mode: InternalSDKMode;
};

export const VisualEditorRoot = ({
  initialLocale,
  mode,
  initialComponentRegistry,
}: VisualEditorRootProps) => {
  // in editor mode locale can change via sendMessage from web app, hence we use the locale from props only as initial locale
  return (
    <Provider store={store}>
      <VisualEditorContextProvider
        initialComponentRegistry={initialComponentRegistry}
        mode={mode}
        initialLocale={initialLocale}>
        <VisualEditor />
      </VisualEditorContextProvider>
    </Provider>
  );
};
