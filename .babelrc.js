const path = require('path');


module.exports = {
  presets: ['es2015'],
  plugins: [
    ['module-alias', [
      {src: path.join(__dirname, 'src', 'lib'), expose: 'lib'},
      {src: path.join(__dirname, 'src', 'client'), expose: 'client'},
      {src: path.join(__dirname, 'src', 'server'), expose: 'server'},
    ]],
    'transform-class-properties',
    'transform-async-to-generator',
    'transform-object-rest-spread',
    'syntax-async-functions',
  ],
};
