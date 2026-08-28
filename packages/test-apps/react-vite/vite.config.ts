import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'module';

const nodeRequire = createRequire(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-emotion'],
      },
    }),
  ],
  resolve: {
    alias: {
      // rolldown (Vite 8) cannot statically trace emotion's ESM named exports;
      // force the CJS build where exports are declared directly on module.exports
      emotion: nodeRequire.resolve('emotion/dist/emotion.cjs.prod.js'),
    },
  },
});
