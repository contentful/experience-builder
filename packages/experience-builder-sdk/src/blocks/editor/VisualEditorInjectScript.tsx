import React, { useEffect } from 'react';
import { VISUAL_EDITOR_CONTAINER_ID } from '@contentful/experience-builder-core/constants';

/**
 * The version can be any semver version or dist tag
 * Examples: @latest, @dev, @pre, @0.0.1-pre-20231213T103332.0
 *
 * If the version is empty, unpkg will redirect to the latest version of the package
 */
const version = '@0.0.1-pre-20231213T210727.0';

/**
 * CDN URL for the visual editor script
 *
 * This can be changed to a local file path for development
 *
 * TODO: Reconsider unpkg
 */
const scriptUrl = `https://unpkg.com/@contentful/experience-builder-visual-editor${version}/dist/renderApp.js`;

/**
 * This component injects the visual editor script into the page
 */
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
