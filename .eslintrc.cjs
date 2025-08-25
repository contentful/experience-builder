module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    // some customer's users use old browser versions https://contentful.atlassian.net/browse/ZEND-6795
    browsers: ['Chrome 91'],
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'compat'],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    'react/prop-types': 'off',
    'compat/compat': 'error',
  },
  overrides: [
    {
      files: ['**/*.spec.*', 'packages/test-apps/**'],
      rules: {
        'compat/compat': 'off',
      },
    },
  ],
};
