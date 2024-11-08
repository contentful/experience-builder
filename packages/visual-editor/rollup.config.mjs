import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';

export default [
  {
    input: 'src/index.tsx',
    output: [
      {
        dir: 'dist',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      postcss({
        plugins: [postcssImport()],
        inject(cssVariableName) {
          return `import styleInject from 'style-inject';\nstyleInject(${cssVariableName});`;
        },
      }),
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        noEmitOnError: process.env.DEV ? false : true,
        exclude: [
          'dist',
          'node_modules',
          'src/**/*.test.tsx',
          'src/**/*.spec.tsx',
          'src/**/*.stories.tsx',
          'test',
        ],
      }),
    ],
    external: [/node_modules\/(?!tslib.*)/],
  },
  {
    input: 'src/index.tsx',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts({ compilerOptions: { noEmitOnError: process.env.DEV ? false : true } })],
    external: [/.css/],
  },
];
