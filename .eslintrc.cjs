module.exports = {
  root: true,
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  extends: [
    require.resolve('@contentful/eslint-config-extension'),
    require.resolve('@contentful/eslint-config-extension/react.js'),
    require.resolve('@contentful/eslint-config-extension/typescript.js'),
  ],
  plugins: ['eslint-plugin-import-helpers'],
  rules: {
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        groups: ['/^react/', 'module', ['parent', 'sibling', 'index']],
        alphabetize: { order: 'asc', ignoreCase: true },
      },
    ],
    'react/react-in-jsx-scope': 'off'
  },
};