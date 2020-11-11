module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  extends: [
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'no-trailing-spaces' : ['error'],
    'no-multi-spaces' : ['error'],
    quotes: ['error', 'single'],
    'space-before-function-paren': ['error', {
        named: 'never',
        anonymous: 'never'
    }],
    'quote-props': ['error', 'as-needed'],
    'max-len': ['error', {
        code: 100,
        ignorePattern: '^const\\s.+=\\s*require\\s*\\('
    }],
    '@typescript-eslint/semi': ['error'],
    '@typescript-eslint/type-annotation-spacing': ['error'],
    '@typescript-eslint/explicit-module-boundary-types': ['error', {
      allowedNames: [
        'from',
        'fromKnowledgeManager',
        'fromGoogleCustomSearchEngine',
        'fromBingCustomSearchEngine',
        'fromZendeskSearchEngine',
        'fromAlgoliaSearchEngine',
        'fromGeneric',
        'fromDirectAnswer',
        'createResultArray'
      ]
    }],
  },
  ignorePatterns: ['dist'],
};
