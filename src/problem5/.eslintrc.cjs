const path = require('path')

/* eslint-env node */
module.exports = {
  env: {
    node: true,
    jest: true,
  },
  plugins: ['@typescript-eslint', 'prettier', 'simple-import-sort', 'promise'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsConfigRootDir: path.resolve(__dirname),
    project: path.resolve(__dirname, './tsconfig.json'),
    sourceType: 'module',
    // Only ESLint 6.2.0 and later support ES2020.
    ecmaVersion: 2020,
  },
  root: true,
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': ['error', { semi: false }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'no-console': 'error',
  },
  ignorePatterns: ['.eslintrc.cjs'],
  settings: {
    node: {
      version: '>=16.0.0',
    },
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.js', '**/*.spec.js'],
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
  ],
}
