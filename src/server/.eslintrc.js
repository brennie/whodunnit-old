module.exports = {
  extends: 'eslint:recommended',
  env: {
    node: true,
    es6: true,
  },
  parser: 'babel-eslint',
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
