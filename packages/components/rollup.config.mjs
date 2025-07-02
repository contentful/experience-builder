import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: './dist/index.js',
        format: 'esm',
        sourcemap: true,
        sourcemapPathTransform: (relativePath) => {
          // For an unknown reason, the sourcemap creates invalid paths for files inside this
          // module. This is a workaround to fix the paths and solve the following warning message:
          // > 'Sourcemap for ".../components/dist/index.js" points to missing source files'
          if (relativePath.startsWith('../../src')) {
            return relativePath.replace('../../src', '../src');
          }
          return relativePath;
        },
      },
    ],
    plugins: [
      postcss({
        plugins: [postcssImport()],
        inject(cssVariableName) {
          return `import styleInject from 'style-inject';\nstyleInject(${cssVariableName});`;
        },
        minimize: !process.env.DEV,
      }),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json', noEmitOnError: process.env.DEV ? false : true }),
    ],
    external: [/node_modules\/(?!tslib.*)/],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts({ compilerOptions: { noEmitOnError: process.env.DEV ? false : true } })],
    external: [/.css/],
  },
];
