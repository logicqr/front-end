import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.es2022 },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      /**
       * Off deliberately: this project does not use PropTypes, which React has
       * deprecated, and the rule produced 166 errors that were all "add a
       * runtime type declaration we do not want". Type safety here would come
       * from TypeScript, not from PropTypes.
       */
      'react/prop-types': 'off',

      /** These two are real bugs, so they stay errors. */
      'react/jsx-key': 'error',
      'no-undef': 'error',

      /**
       * A caught error that is deliberately ignored is a legitimate pattern
       * (tracking must never break a page), so allow `catch {}` and an
       * underscore prefix to mean "intentionally unused".
       */
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
        },
      ],

      'react/no-unescaped-entities': ['warn', { forbid: ['>', '}'] }],
      'react/jsx-no-target-blank': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      /** Leftover debugging output should not reach production. */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Data modules export content, not components.
    files: ['src/data/**/*.{js,jsx}', 'src/lib/**/*.{js,jsx}', 'src/styles/**'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
];
