const path = require('path');


module.exports = {
  presets: ['es2015'],
  plugins: [
    ['module-alias', [
      {src: path.join(__dirname, 'src', 'lib'), expose: 'lib'},
    ]],
    'transform-class-properties',
    'transform-async-to-generator',
    'transform-object-rest-spread',
    'syntax-async-functions',
  ]
};
