import React, { useEffect } from 'react';
import { VISUAL_EDITOR_CONTAINER_ID } from '@contentful/experience-builder-types';

/**
 * The version can be any semver version or dist tag
 * Examples: @latest, @dev, @pre, @0.0.1-pre-20231213T103332.0
 *
 * If the version is empty, unpkg will redirect to the latest version of the package
 */
const version = '@0.0.1-pre-20231213T210727.0';

// CDN URL for the visual editor script
const scriptUrl = `https://unpkg.com/@contentful/experience-builder-visual-editor${version}/dist/renderApp.js`;

export default function VisualEditorInjectScript() {
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
