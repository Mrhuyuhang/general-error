module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  parser: '@babel/eslint-parser',
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {},
};
