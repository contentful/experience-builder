import { defineConfig } from 'tsup';
import svgr from 'esbuild-plugin-svgr';

export default defineConfig((options) => ({
  entry: ['src/index.ts', 'src/preview.ts', 'src/manager.tsx'],
  splitting: false,
  minify: !options.watch,
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  treeshake: true,
  sourcemap: true,
  clean: true,
  platform: 'browser',
  esbuildOptions(options) {
    options.conditions = ['module'];
  },
  esbuildPlugins: [svgr()] as any,
}));
