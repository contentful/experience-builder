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
        preserveModules: true,
      },
    ],
    plugins: [nodeResolve(), typescript({ tsconfig: './tsconfig.json' })],
    external: [/node_modules\/(?!tslib.*)/],
    treeshake: false,
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
    plugins: [nodeResolve(), typescript({ tsconfig: './tsconfig.json' })],
    external: [/node_modules\/(?!tslib.*)/],
    treeshake: false,
  },
  //typings
  {
    input: 'src/index.ts',
    output: [{ dir: 'dist', format: 'esm', preserveModules: true }],
    plugins: [dts({ tsconfig: './tsconfig.json' })],
    external: [/.css/],
    treeshake: false,
  },
  {
    input: 'src/exports.ts',
    output: [{ dir: 'dist', format: 'esm', preserveModules: true }],
    plugins: [dts({ tsconfig: './tsconfig.json' })],
    external: [/.css/],
    treeshake: false,
  },
];
