import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true,
        // Tells CJS consumer that this module originally had ESM semantics, e.g. this enables spying on named exports
        esModule: true,
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json', noEmitOnError: process.env.DEV ? false : true }),
    ],
    external: [/node_modules\/(?!tslib.*)/],
  },
  //specific exports in package.json
  {
    input: 'src/exports.ts',
    output: [
      {
        file: 'dist/constants.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/constants.cjs',
        format: 'cjs',
        sourcemap: true,
        // Tells CJS consumer that this module originally had ESM semantics, e.g. this enables spying on named exports
        esModule: true,
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json', noEmitOnError: process.env.DEV ? false : true }),
    ],
    external: [/node_modules\/(?!tslib.*)/],
  },
  //typings
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [
      dts({
        tsconfig: './tsconfig.json',
        compilerOptions: { noEmitOnError: process.env.DEV ? false : true },
      }),
    ],
    external: [/.css/],
  },
  {
    input: 'src/constants.ts',
    output: [{ file: 'dist/constants.d.ts', format: 'esm' }],
    plugins: [
      dts({
        tsconfig: './tsconfig.json',
        compilerOptions: { noEmitOnError: process.env.DEV ? false : true },
      }),
    ],
    external: [/.css/],
  },
];
