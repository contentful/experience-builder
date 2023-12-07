import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';

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
        plugins: [postcssImport()],
      }),

      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
    ],
    external: [/node_modules\/(?!tslib.*)/],
  },
  {
    input: 'src/index.tsx',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
