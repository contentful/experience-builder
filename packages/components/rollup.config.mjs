import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import fg from 'fast-glob';
import path from 'path';

const optionalComponents = fg.sync('src/components/optional/**/index.ts');

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

  // TypeScript declaration files configuration for main bundle
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts({ compilerOptions: { noEmitOnError: process.env.DEV ? false : true } })],
    external: [/.css/],
  },

  // Separate bundles for each optional component
  ...optionalComponents.map((filePath) => ({
    input: filePath,
    output: {
      file: `dist/${path.basename(path.dirname(filePath))}/index.js`,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      postcss({
        plugins: [postcssImport()],
        inject(cssVariableName) {
          return `import styleInject from 'style-inject';\nstyleInject(${cssVariableName});`;
        },
      }),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json', noEmitOnError: process.env.DEV ? false : true }),
    ],
    external: [/node_modules\/(?!tslib.*)/],
  })),

  // Generate type declarations for each component
  ...optionalComponents.map((filePath) => ({
    input: filePath,
    output: {
      file: `dist/${path.basename(path.dirname(filePath))}/index.d.ts`,
      format: 'es',
    },
    plugins: [dts({ compilerOptions: { noEmitOnError: process.env.DEV ? false : true } })],
    external: [/.css/],
  })),
];
