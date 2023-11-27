import React from 'react';
import ReactDOM from 'react-dom';
import { VisualEditor } from './components';
import { VisualEditorRoot, VisualEditorRootProps } from './VisualEditorRoot';

(function init() {
  if (typeof window !== 'undefined') {
    window.InitializeVisualEditor = (config: VisualEditorRootProps, element: HTMLElement) => {
      ReactDOM.render(<VisualEditorRoot {...config} />, element);
    };
    window.dispatchEvent(new Event('VisualEditorInitialized'));
  }
})();

export { VisualEditor };
