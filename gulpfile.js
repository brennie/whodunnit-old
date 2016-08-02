'use strict';

const gulp = require('gulp');


gulp.task('lint:css', () => {
  const colorguard = require('gulp-colorguard');
  const stylelint = require('gulp-stylelint');

  return gulp.src(['src/**.css'])
    .pipe(colorguard())
    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true},
      ],
    }));
});


gulp.task('lint:js:server', () => {
  const eslint = require('gulp-eslint');
  const eslintConfig = require('./src/server/.eslintrc.js');

  return gulp.src(['src/server/**.js'])
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('lint:js:client', () => {
  const eslint = require('gulp-eslint');
  const eslintConfig = require('./src/client/.eslintrc.js');

  return gulp.src(['src/client/**.js', 'src/client/**.jsx'])
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
})


gulp.task('lint:js', ['lint:js:client', 'lint:js:server']);
gulp.task('lint', ['lint:js', 'lint:css']);
