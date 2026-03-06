import antfu from '@antfu/eslint-config'
import pluginCasePolice from 'eslint-plugin-case-police'
import pluginPromise from 'eslint-plugin-promise'
import pluginRegex from 'eslint-plugin-regex'
import pluginRegexp from 'eslint-plugin-regexp'
import pluginSonarjs from 'eslint-plugin-sonarjs'
import globals from 'globals'

export default antfu(
  {
    vue: true,
    typescript: true,
    stylistic: {
      indent: 2,
      semi: false,
      quotes: 'single',
    },
    ignores: [
      'src/plugins/iconify/*.js',
      'node_modules',
      'dist',
      '*.d.ts',
      'vendor',
      '*.json',
      '.eslintrc.cjs', // Arquivo antigo de configuração
    ],
  },

  // Configuração para todos os arquivos
  {
    files: ['**/*.{js,mjs,cjs,ts,vue,tsx,jsx}'],
    plugins: {
      // Plugins adicionais que não estão no antfu
      'promise': pluginPromise,
      'sonarjs': pluginSonarjs,
      'case-police': pluginCasePolice,
      'regexp': pluginRegexp,
      'regex': pluginRegex,
    },
    languageOptions: {
      ecmaVersion: 13,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      // Regras de ambiente
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

      // Regras de formatação
      'comma-spacing': ['error', { before: false, after: true }],
      'key-spacing': ['error', { afterColon: true }],
      'n/prefer-global/process': ['off'],
      'sonarjs/cognitive-complexity': ['off'],

      // Regras do Vue
      'vue/first-attribute-linebreak': ['error', {
        singleline: 'beside',
        multiline: 'below',
      }],

      // Regras do Antfu
      'antfu/top-level-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // Indentação
      'indent': ['error', 2],

      // Trailing comma
      'comma-dangle': ['error', 'always-multiline'],

      // Espaçamento em objetos
      'object-curly-spacing': ['error', 'always'],

      // Naming convention
      'camelcase': 'error',

      // Desabilitar max-len
      'max-len': 'off',

      // Sem ponto e vírgula
      'semi': ['error', 'never'],

      // Arrow functions
      'arrow-parens': ['error', 'as-needed'],

      // Newline before return
      'newline-before-return': 'error',

      // Lines around comment
      'lines-around-comment': [
        'error',
        {
          beforeBlockComment: true,
          beforeLineComment: true,
          allowBlockStart: true,
          allowClassStart: true,
          allowObjectStart: true,
          allowArrayStart: true,
          ignorePattern: '!SECTION',
        },
      ],

      // Unused vars
      '@typescript-eslint/no-unused-vars': ['error', {
        varsIgnorePattern: '^_+$',
        argsIgnorePattern: '^_+$',
      }],

      // Array formatting
      'array-element-newline': ['error', 'consistent'],
      'array-bracket-newline': ['error', 'consistent'],

      // Vue rules
      'vue/multi-word-component-names': 'off',

      // Padding between statements
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'expression', next: 'const' },
        { blankLine: 'always', prev: 'const', next: 'expression' },
        { blankLine: 'always', prev: 'multiline-const', next: '*' },
        { blankLine: 'always', prev: '*', next: 'multiline-const' },
      ],

      // Plugin: eslint-plugin-import (regras comentadas temporariamente - serão reativadas após verificar compatibilidade)
      // 'import/prefer-default-export': 'off',
      // 'import/newline-after-import': ['error', { count: 1 }],
      'no-restricted-imports': ['error', 'vuetify/components', {
        name: 'vue3-apexcharts',
        message: 'apexcharts are auto imported',
      }],

      // Extensions (comentado temporariamente)
      // 'import/extensions': [
      //   'error',
      //   'ignorePackages',
      //   {
      //     js: 'never',
      //     jsx: 'never',
      //     ts: 'never',
      //     tsx: 'never',
      //   },
      // ],

      // Ignore virtual files (comentado temporariamente)
      // 'import/no-unresolved': [2, {
      //   ignore: [
      //     '~pages$',
      //     'virtual:meta-layouts',
      //     '#auth$',
      //     '#components$',
      //     '.*\\?raw',
      //   ],
      // }],

      // Shadow
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error'],

      // '@typescript-eslint/consistent-type-imports': 'error', // Requer type information - comentado temporariamente

      // Plugin: eslint-plugin-promise
      'promise/always-return': 'off',
      'promise/catch-or-return': 'off',

      // ESLint plugin vue
      'vue/block-tag-newline': 'error',
      'vue/component-api-style': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase', {
        registeredComponentsOnly: false,
        ignores: ['/^swiper-/'],
      }],
      'vue/custom-event-name-casing': ['error', 'camelCase', {
        ignores: [
          '/^(click):[a-z]+((\\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?/',
        ],
      }],
      'vue/define-macros-order': 'error',
      'vue/html-comment-content-newline': 'error',
      'vue/html-comment-content-spacing': 'error',
      'vue/html-comment-indent': 'error',
      'vue/match-component-file-name': 'error',
      'vue/no-child-content': 'error',
      'vue/require-default-prop': 'off',
      'vue/no-duplicate-attr-inheritance': 'error',
      'vue/no-empty-component-block': 'error',
      'vue/no-multiple-objects-in-class': 'error',
      'vue/no-reserved-component-names': 'error',
      'vue/no-template-target-blank': 'error',
      'vue/no-useless-mustaches': 'error',
      'vue/no-useless-v-bind': 'error',
      'vue/padding-line-between-blocks': 'error',
      'vue/prefer-separate-static-class': 'error',
      'vue/prefer-true-attribute-shorthand': 'error',

      // 'vue/v-on-function-call': 'error', // Regra não disponível nesta versão
      'vue/no-restricted-class': ['error', '/^(p|m)(l|r)-/'],
      'vue/valid-v-slot': ['error', {
        allowModifiers: true,
      }],
      'vue/no-irregular-whitespace': 'error',
      'vue/template-curly-spacing': 'error',

      // Sonarlint
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/no-nested-template-literals': 'off',

      // Plugin: eslint-plugin-regex
      'regex/invalid': [
        'error',
        [
          {
            regex: '@images',
            replacement: '@images',
            message: 'Use \'@images\' path alias for image imports',
          },
          {
            regex: '@styles',
            replacement: '@styles',
            message: 'Use \'@styles\' path alias for importing styles from \'src/assets/styles\'',
          },
          {
            regex: '@core/\\w',
            message: 'You can\'t use @core when you are in @layouts module',
            files: {
              inspect: '@layouts/.*',
            },
          },
          {
            regex: 'useLayouts\\(',
            message: '`useLayouts` composable is only allowed in @layouts & @core directory. Please use `useThemeConfig` composable instead.',
            files: {
              inspect: '^(?!.*(@core|@layouts)).*',
            },
          },
        ],

        // Ignore files
        '\\.eslintrc\\.cjs',
      ],
    },
  },
)
