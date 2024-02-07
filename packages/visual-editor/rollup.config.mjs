import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import injectProcessEnv from 'rollup-plugin-inject-process-env';

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
  {
    input: 'src/renderApp.tsx',
    output: [
      {
        file: './dist/renderApp.js',
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
      injectProcessEnv({
        NODE_ENV: 'production',
      }),
      typescript({ tsconfig: './tsconfig.json', noEmitOnError: process.env.DEV ? false : true }),
    ],
    external: [],
  },
];
