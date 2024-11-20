import react from '@vitejs/plugin-react-swc';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  build: {
    sourcemap: true,
    outDir: './dist',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
      },
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      external: ['node_modules'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@contentful/experiences-visual-editor-react': resolve(
        __dirname,
        'node_modules/@contentful/experiences-visual-editor-react/dist/index.js',
      ),
    },
  },
  plugins: [svgr(), react(), dts(), cssInjectedByJsPlugin()],
});
