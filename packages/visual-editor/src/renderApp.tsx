import './global.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { VisualEditorRoot } from './components/VisualEditorRoot';
import { VISUAL_EDITOR_CONTAINER_ID } from '@contentful/experiences-core/constants';

ReactDOM.createRoot(document.getElementById(VISUAL_EDITOR_CONTAINER_ID)!).render(
  <React.StrictMode>
    <VisualEditorRoot metadata={{}} />
  </React.StrictMode>,
);
