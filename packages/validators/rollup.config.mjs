import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true,
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
    output: [{ dir: 'dist', format: 'esm' }],
    plugins: [
      dts({
        tsconfig: './tsconfig.json',
        compilerOptions: { noEmitOnError: process.env.DEV ? false : true },
      }),
    ],
  },
  {
    input: 'src/types.ts',
    output: [{ dir: 'dist', format: 'esm' }],
    plugins: [
      dts({
        tsconfig: './tsconfig.json',
        compilerOptions: { noEmitOnError: process.env.DEV ? false : true },
      }),
    ],
  },
];
