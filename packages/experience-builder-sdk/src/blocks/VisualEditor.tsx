import React, { Suspense, useEffect } from 'react';
import { InternalSDKMode } from '../types';
import { VisualEditorContextProvider } from './editor/VisualEditorContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

const version = '0.0.1-pre-20231212T210325.0';
const scriptUrl = `https://unpkg.com/@contentful/experience-builder-visual-editor@${version}/dist/renderApp.js`;

// const scriptUrl =
//   '/Users/adrian.meyer/Repos/experience-builder-toolkit/packages/visual-editor/dist/renderApp.js';

const VisualEditor: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = scriptUrl;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="cf-visual-editor" />;
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
          <VisualEditor />
        </VisualEditorContextProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

export default VisualEditorRoot;
