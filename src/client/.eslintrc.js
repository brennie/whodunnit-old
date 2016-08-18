const baseConfig = require('../.eslintrc.js');


module.exports = Object.assign({}, baseConfig, {
  extends: [
    ...baseConfig.extends,
    'plugin:react/recommended'
  ],
  env: Object.assign({}, baseConfig.env, {
    browser: true,
  }),
  plugins: [
    ...baseConfig.plugins,
    'react',
  ],
  globals: {
    process: false,
  },
});
