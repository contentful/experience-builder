import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import nodeExternals from 'rollup-plugin-node-externals';
import preserveDirectives from 'rollup-plugin-preserve-directives';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: './dist',
        format: 'esm',
        sourcemap: true,
        preserveModules: true,
      },
    ],
    plugins: [
      preserveDirectives(),
      nodeExternals(),
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
    onwarn(log, handler) {
      //swallow warnings about using 'use client' directive
      if (log.message.indexOf('Module level directives cause errors when bundled, "use client"') > -1) {
        return;
      }
      handler(log)
    },
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts({ compilerOptions: { noEmitOnError: process.env.DEV ? false : true } })],
  },
];
