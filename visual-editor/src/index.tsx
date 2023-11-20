import React from 'react';
import ReactDOM from 'react-dom';
import { VisualEditor } from './components';
import { InitConfig } from './types';

(function init() {
  if (typeof window !== 'undefined') {
    window.InitializeVisualEditor = (config: InitConfig, element: HTMLElement) => {
      ReactDOM.render(<VisualEditor {...config} />, element);
    };
    window.dispatchEvent(new Event('VisualEditorInitialized'));
  }
})();

export { VisualEditor };
