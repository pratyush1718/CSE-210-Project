const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      prettier,
      'unused-imports': unusedImports,
    },
    rules: {
      'prettier/prettier': ['warn'],
      camelcase: ['error', { properties: 'always' }],
      '@typescript-eslint/no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
      'unused-imports/no-unused-imports': 'warn',
    },
  },
);
