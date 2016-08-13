module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  env: {
    browser: true,
    es6: true,
  },
  parser: 'babel-eslint',
  plugins: [
    'react'
  ],
  rules: {
    indent: ['error', 2, {
      SwitchCase: 1,
    }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', {
      allowTemplateLiterals: true,
      avoidEscape: true,
    }],
    semi: ['error', 'always'],
  }
};
