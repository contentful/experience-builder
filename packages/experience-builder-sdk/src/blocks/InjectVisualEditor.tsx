import React, { useEffect } from 'react';
import { VISUAL_EDITOR_CONTAINER_ID } from '@contentful/experience-builder-types';

const version = '0.0.1-pre-20231213T103332.0';
const scriptUrl = `https://unpkg.com/@contentful/experience-builder-visual-editor@${version}/dist/renderApp.js`;

export default function VisualEditor() {
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

  return <div id={VISUAL_EDITOR_CONTAINER_ID} />;
}
