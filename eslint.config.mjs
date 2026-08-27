import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import compatPlugin from 'eslint-plugin-compat';
import jestPlugin from 'eslint-plugin-jest';
import vitestPlugin from '@vitest/eslint-plugin';

export default [
  {
    ignores: [
      'testing-library.js',
      'commitlint.config.cjs',
      'lint-staged.config.cjs',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/.coverage/**',
      '**/.cache/**',
      '**/*.cjs',
      '**/next-env.d.ts',
      'examples/**',
    ],
  },

  js.configs.recommended,

  ...tsPlugin.configs['flat/recommended'],

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      compat: compatPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    settings: {
      react: { version: '18.3.1' },
      browsers: ['Chrome 91'],
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', ignoreRestSiblings: true }],
      'compat/compat': 'error',
    },
  },

  {
    files: ['**/*.spec.*', 'packages/test-apps/**/*'],
    rules: {
      'compat/compat': 'off',
    },
  },

  {
    files: ['packages/experience-builder-sdk/**/*.spec.*'],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: jestPlugin.configs['flat/recommended'].languageOptions.globals,
    },
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
    },
  },

  {
    files: [
      'packages/components/**/*.spec.*',
      'packages/core/**/*.spec.*',
      'packages/validators/**/*.spec.*',
      'packages/visual-editor/**/*.spec.*',
    ],
    plugins: { vitest: vitestPlugin },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      'vitest/no-focused-tests': 'error',
    },
  },
];
