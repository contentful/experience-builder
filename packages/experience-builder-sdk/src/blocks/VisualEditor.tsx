import React, { Suspense, useEffect } from 'react';
import { InternalSDKMode } from '../types';
import { VisualEditorContextProvider } from './editor/VisualEditorContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

// const scriptUrl = 'https://unpkg.com/@contentful/experience-builder-visual-editor';
// const scriptUrl =
//   'https://unpkg.com/@contentful/experience-builder-visual-editor@0.0.1-pre-20231208T034641.0/dist/index.js';

const scriptUrl =
  '/Users/adrian.meyer/Repos/experience-builder-toolkit/packages/visual-editor/dist/renderApp.js';

const VisualEditor: React.FC<{ elementId: string }> = ({ elementId }) => {
  useEffect(() => {
    console.log('[SDK::DEBUG] VisualEditor useEffect...');

    const script = document.createElement('script');
    script.type = 'module';
    script.src = scriptUrl;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id={elementId} />;
};

type Props = {
  initialLocale: string;
  mode: InternalSDKMode;
};

export const VisualEditorRoot: React.FC<Props> = ({ initialLocale, mode }) => {
  // in editor mode locale can change via sendMessage from web app, hence we use the locale from props only as initial locale
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <VisualEditorContextProvider mode={mode} initialLocale={initialLocale}>
          <VisualEditor elementId="cf-visual-editor" />
        </VisualEditorContextProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

export default VisualEditorRoot;
