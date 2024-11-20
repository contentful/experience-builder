import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import fg from 'fast-glob';
import path from 'path';

const optionalComponentInputs = fg.sync('src/components/optional/**/index.ts');

const bundleConfig = {
  plugins: [
    postcss({
      plugins: [postcssImport()],
      inject(cssVariableName) {
        return `import styleInject from 'style-inject';\nstyleInject(${cssVariableName});`;
      },
    }),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      noEmitOnError: process.env.DEV ? false : true,
      sourceMap: true,
      inlineSources: true,
    }),
  ],
  external: [/node_modules\/(?!tslib.*)/],
};

export default [
  // Main bundle configuration
  {
    input: 'src/index.ts',
    output: [
      {
        file: './dist/index.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    ...bundleConfig,
  },
  // Optional component bundles configuration
  {
    input: optionalComponentInputs,
    output: [
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: (chunkInfo) => {
          const componentName = path.basename(path.dirname(chunkInfo.facadeModuleId));
          return `${componentName}/index.js`;
        },
        chunkFileNames: '[name]-[hash].js',
        sourcemap: true,
      },
    ],
    ...bundleConfig,
  },
  // TypeScript declaration files configuration for optional components
  ...optionalComponentInputs.map((input) => ({
    input,
    output: [{ file: `dist/${path.basename(path.dirname(input))}/index.d.ts`, format: 'es' }],
    plugins: [dts({ compilerOptions: { noEmitOnError: process.env.DEV ? false : true } })],
    external: [/.css/],
  })),
  // TypeScript declaration files configuration for main bundle
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts({ compilerOptions: { noEmitOnError: process.env.DEV ? false : true } })],
    external: [/.css/],
  },
];
