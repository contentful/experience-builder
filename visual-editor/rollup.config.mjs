import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import injectProcessEnv from 'rollup-plugin-inject-process-env';

import packageJson from './package.json' assert { type: 'json' };

export default [
  {
    input: 'src/index.tsx',
    output: [
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      postcss({
        extract: true,
        modules: true,
        plugins: [postcssImport()],
      }),
      // peerDepsExternal(),
      resolve(),
      commonjs(),
      injectProcessEnv({
        NODE_ENV: 'production',
      }),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
    ],
    // external: ['react', 'react-dom'],
  },
  {
    input: 'src/index.tsx',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
