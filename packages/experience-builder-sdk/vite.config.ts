import react from '@vitejs/plugin-react-swc';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';
//@ts-expect-error ignore
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

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
      plugins: [peerDepsExternal()],
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
  plugins: [svgr(), react(), dts(), cssInjectedByJsPlugin()],
});
