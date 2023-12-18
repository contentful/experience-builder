import './global.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { VisualEditorRoot } from './components/VisualEditorRoot';
import { VISUAL_EDITOR_CONTAINER_ID } from '@contentful/experience-builder-core/constants';

ReactDOM.createRoot(document.getElementById(VISUAL_EDITOR_CONTAINER_ID)!).render(
  <React.StrictMode>
    <VisualEditorRoot />
  </React.StrictMode>
);
