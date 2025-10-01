import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { defineDesignTokens } from '@contentful/experiences-sdk-react';

defineDesignTokens({
  spacing: { XS: '4px', S: '16px', M: '32px', L: '64px', XL: '128px' },
  sizing: { XS: '16px', S: '100px', M: '300px', L: '600px', XL: '1024px' },
  color: {
    Slate: '#94a3b8aa',
    Azure: 'azure',
    Orange: '#fdba74',
    Blue: '#0000ff',
    'Lighter Blue': '#85d7ff',
  },
  textColor: { Dark: '#1a1a1a', Light: '#efefef', Slate: '#94a3b8' },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
