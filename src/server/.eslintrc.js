const baseConfig = require('../.eslintrc.js');

module.exports = Object.assign({}, baseConfig, {
  env: Object.assign({}, baseConfig.env, {
    node: true
  }),
});
