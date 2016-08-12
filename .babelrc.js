const path = require('path');


module.exports = {
  presets: ['es2015'],
  plugins: [
    ['module-alias', [
      {src: path.join(__dirname, 'src', 'lib'), expose: 'lib'},
    ]],
    'transform-async-to-generator',
    'syntax-async-functions',
  ]
};
