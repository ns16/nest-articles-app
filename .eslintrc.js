module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'airbnb-base',
    'airbnb-typescript/base'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/comma-dangle': [
      'error',
      'never'
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        ignoredNodes: ['PropertyDefinition']
      }
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_$',
        varsIgnorePattern: '^_$'
      }
    ],
    '@typescript-eslint/semi': [
      'error',
      'always'
    ],
    'arrow-body-style': [
      'error',
      'as-needed'
    ],
    'arrow-parens': [
      'error',
      'as-needed'
    ],
    'class-methods-use-this': 'off',
    'comma-dangle': 'off', // used @typescript-eslint/comma-dangle instead
    'consistent-return': 'off',
    'import/extensions': 'off',
    'import/no-cycle': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          "**/*.spec.ts",
          "test/**/*.ts",
          "src/common/test/helpers.ts"
        ]
      }
    ],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        },
        groups: [
          'builtin',
          'external',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always'
      }
    ],
    'import/prefer-default-export': 'off',
    'indent': 'off', // used @typescript-eslint/indent instead
    'max-len': [
      'error',
      {
        code: 150,
        comments: 150,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        tabWidth: 2
      }
    ],
    'new-cap': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
    'no-else-return': [
      'error',
      {
        allowElseIf: true
      }
    ],
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-return-assign': [
      'error',
      'except-parens'
    ],
    'no-restricted-syntax': [
      'off',
      'ForOfStatement'
    ],
    'no-return-await': 'off',
    'no-shadow': 'off', // used @typescript-eslint/no-shadow instead
    'no-unused-vars': 'off', // used @typescript-eslint/no-unused-vars instead
    'object-curly-newline': 'off',
    'operator-linebreak': [
      'error',
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before'
        }
      }
    ],
    'prettier/prettier': 'off',
    semi: 'off' // used @typescript-eslint/semi instead
  }
};
