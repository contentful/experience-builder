import React, { Suspense, useEffect } from 'react';
import { InternalSDKMode } from '../types';
import { VisualEditorContextProvider } from './editor/VisualEditorContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

//============================================================
// Import the visual editor directly from the package
// import VisualEditor from '@contentful/experience-builder-visual-editor';

//============================================================
// Lazy load the visual editor from the package
// const VisualEditor = React.lazy(() => import('@contentful/experience-builder-visual-editor'));

//============================================================
// Lazy load the visual editor from a CDN - this is the ideal solution if we can get it to work
// const VisualEditor = React.lazy(
//   () =>
//     import(
//       'https://unpkg.com/@contentful/experience-builder-visual-editor@0.0.1-pre-20231212T111240.0/dist/index.js'
//     )
// );

//============================================================
// Lazy load the visual editor from a CDN with a specific version
// const VisualEditor = React.lazy(
//   () =>
//     import(
//       'https://unpkg.com/@contentful/experience-builder-visual-editor@0.0.1-pre-20231208T034641.0/dist/index.js'
//     )
// );

// type VisualEditorRootProps = {
//   initialLocale: string;
//   initialComponentRegistry: Map<string, ComponentRegistration>;
// };

//============================================================
// Inject script

// const scriptUrl = 'https://unpkg.com/@contentful/experience-builder-visual-editor';
// const scriptUrl =
//   'https://unpkg.com/@contentful/experience-builder-visual-editor@0.0.1-pre-20231208T034641.0/dist/index.js';

const scriptUrl =
  '/Users/adrian.meyer/Repos/experience-builder-toolkit/packages/visual-editor/dist/renderApp.js';

// const loaded = new Map<string, string>();

const VisualEditor: React.FC<{ elementId: string }> = ({ elementId }) => {
  useEffect(() => {
    console.log('[SDK::DEBUG] VisualEditor useEffect...');

    // if (loaded.get(initialLocale) === scriptUrl) {
    //   return;
    // }

    // const element = document.getElementById(elementId);
    // if (!element) {
    //   console.error('No editor container found');
    //   return;
    // }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = scriptUrl;
    script.async = true;

    // script.onload = () => {
    //   loaded.set(initialLocale, scriptUrl);
    //   window.cfInitVisualEditor(element, { initialLocale, initialComponentRegistry });
    // };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id={elementId} />;
};

// const VisualEditor = React.lazy(() =>
//   loadRemoteScript(scriptUrl).then(() => {
//     console.log('[SDK::DEBUG] script loaded from', scriptUrl);
//     console.log('[SDK::DEBUG] window.cfVisualEditor:', window.cfVisualEditor);
//     return typeof window.cfInitVisualEditor === 'function'
//       ? {
//           default: window.cfInitVisualEditor,
//         }
//       : Promise.reject(new Error('what the frick'));
//   })
// );

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
