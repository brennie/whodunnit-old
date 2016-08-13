module.exports = {
  extends: ['eslint:recommended'],
  env: {es6: true},
  parser: 'babel-eslint',
  plugins: ['babel'],
  rules: {
    'arrow-parens': 'off',
    'babel/arrow-parens': ['error', 'as-needed'],

    'object-shorthand': 'off',
    'babel/object-shorthand': ['error', 'always'],

    indent: ['error', 2, {
      SwitchCase: 1,
    }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', {
      allowTemplateLiterals: true,
      avoidEscape: true,
    }],
    semi: ['error', 'always'],
  },
};
