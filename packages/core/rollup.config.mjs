import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve(),
      typescript({ tsconfig: './tsconfig.json', noEmitOnError: process.env.DEV ? false : true }),
    ],
    external: [/node_modules\/(?!tslib.*)/],
  },
  //specific exports in package.json
  {
    input: 'src/exports.ts',
    output: [
      {
        dir: 'dist',
        format: 'esm',
        sourcemap: true,
        preserveModules: true,
      },
    ],
    plugins: [
      nodeResolve(),
      typescript({ tsconfig: './tsconfig.json', noEmitOnError: process.env.DEV ? false : true }),
    ],
    external: [/node_modules\/(?!tslib.*)/],
  },
  //typings
  {
    input: 'src/index.ts',
    output: [{ dir: 'dist', format: 'esm', preserveModules: true }],
    plugins: [
      dts({
        tsconfig: './tsconfig.json',
        compilerOptions: { noEmitOnError: process.env.DEV ? false : true },
      }),
    ],
    external: [/.css/],
  },
  {
    input: 'src/exports.ts',
    output: [{ dir: 'dist', format: 'esm', preserveModules: true }],
    plugins: [
      dts({
        tsconfig: './tsconfig.json',
        compilerOptions: { noEmitOnError: process.env.DEV ? false : true },
      }),
    ],
    external: [/.css/],
  },
];
