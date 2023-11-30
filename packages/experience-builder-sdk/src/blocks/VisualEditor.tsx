import React, { useEffect } from 'react';
import { ComponentRegistration, CompositionTree, InternalSDKMode } from '../types';
import { VisualEditorContextProvider } from './editor/VisualEditorContext';
import { componentRegistry } from '../core/componentRegistry';
import { useEditorContext } from './editor/useEditorContext';

// const bundleUrl = 'https://storage.googleapis.com/sandbox-eb/bundle.js';

export interface Config {
  initialLocale: string;
  initialTree: CompositionTree;
  initialComponentRegistry: Map<string, ComponentRegistration>;
  mode: InternalSDKMode;
}

declare global {
  interface Window {
    InitializeVisualEditor: (config: Config, element: HTMLElement) => void;
  }
}

const loaded: Record<string, boolean> = {};

function addScript(url: string) {
  if (!loaded[url]) {
    const s = document.createElement('script');
    s.src = url;
    document.body.appendChild(s);
    loaded[url] = true;
  }
}

function addStyles(url: string) {
  if (!loaded[url]) {
    // Create new link Element
    const link = document.createElement('link');

    // set the attributes for link element
    link.rel = 'stylesheet';

    link.type = 'text/css';

    link.href = url;
    document.head.appendChild(link);
    loaded[url] = true;
  }
}

const VisualEditor = () => {
  const { bundleUrl, stylesUrl, tree, locale } = useEditorContext();

  useEffect(() => {
    const init = () => {
      const editor = document.getElementById('visual-editor');

      if (!editor) {
        console.error('No editor container found');
        return;
      }

      setTimeout(() => {
        const components: ComponentRegistration[] = [];

        componentRegistry.forEach((comp) => {
          components.push(comp);
        });

        window.InitializeVisualEditor(
          {
            initialComponentRegistry: componentRegistry,
            initialLocale: locale || 'en-US',
            initialTree: tree!,
            mode: 'editor',
          },
          editor
        );
      }, 200);
    };

    window.addEventListener('VisualEditorInitialized', init);

    return () => {
      window.removeEventListener('VisualEditorInitialized', init);
    };
  }, []);

  useEffect(() => {
    if (!bundleUrl || !stylesUrl) {
      return;
    }

    addStyles(stylesUrl);
    addScript(bundleUrl);
  }, [bundleUrl, stylesUrl]);

  return <div id="visual-editor" />;
};

type VisualEditorRootProps = {
  initialLocale: string;
  mode: InternalSDKMode;
};

export const VisualEditorRoot = ({ initialLocale, mode }: VisualEditorRootProps) => {
  // in editor mode locale can change via sendMessage from web app, hence we use the locale from props only as initial locale
  return (
    <VisualEditorContextProvider mode={mode} initialLocale={initialLocale}>
      <VisualEditor />
    </VisualEditorContextProvider>
  );
};

export default VisualEditorRoot;
