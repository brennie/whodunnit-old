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


gulp.task('lint:js', () => {
  const eslint = require('gulp-eslint');
  const eslintConfig = require('./.eslintrc.js');

  return gulp.src(['src/**.js', 'src/**.jsx'])
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('lint', ['lint:js', 'lint:css']);
