'use strict';

const fork = require('child_process').fork;

const gulp = require('gulp');
const gutil = require('gulp-util');
const yargs = require('yargs');

const production = yargs
  .boolean('production')
  .argv
  .production;

const serverEnv = production ? 'production' : 'development';


gulp.task('default', ['serve']);


/*
 * Server tasks.
 */

/* Run the server.
 *
 * The server will restart whenever source files are modified.
 */
{
  let serverProc = null;

  gulp.task('serve', ['build:server', 'build:client'], () => {
    const startServer = () => {
      const env = Object.assign(process.env, {
        NODE_ENV: serverEnv,
      });

      gutil.log('[serve]', `Starting ${serverEnv} server...`);
      serverProc = fork('dist/server/index.js', [], {env});

      /* Live-reload the server whenever the source changes. */
      if (development){
        gulp.watch('./src/server/**/*.js', ['serve']);
      }
    }

    /* If the server is already running, kill it and restart it.*/
    if (serverProc) {
      gutil.log('[serve]', `Stopping ${serverEnv} server...`);
      serverProc.on('exit', startServer);
      serverProc.kill();
      serverProc = null;
    } else {
      startServer();
    }
  });
}


/*
 * Compilation tasks.
 */

/* Build everything. */
gulp.task('build', ['build:server', 'build:client']);

/* Build the server-side JS. */
gulp.task('build:server', () => {
  const babel = require('gulp-babel');

  return gulp.src('src/server/**.js')
    .pipe(babel({
      presets: ['es2015'],
      plugins: [
        'transform-async-to-generator',
        'syntax-async-functions',
      ]
    }))
    .pipe(gulp.dest('dist/server'));
});


/* Build the client. */
gulp.task('build:client', ['build:client:html']);

/* Build the client-side HTML
 *
 * This just copies all HTML to the dist/ directory.
 */
gulp.task('build:client:html', () => {
  return gulp.src('./src/client/**/*.html')
    .pipe(gulp.dest('./dist/client/'));
});

/*
 * Linting tasks.
 */

/* Lint everything. */
gulp.task('lint', ['lint:js', 'lint:css']);

/* Lint all JS. */
gulp.task('lint:js', ['lint:js:client', 'lint:js:server']);

/* Lint the server-side JS */
gulp.task('lint:js:server', () => {
  const eslint = require('gulp-eslint');
  const eslintConfig = require('./src/server/.eslintrc.js');

  return gulp.src('src/server/**/*.js')
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/* Lint the client-side JS. */
gulp.task('lint:js:client', () => {
  const eslint = require('gulp-eslint');
  const eslintConfig = require('./src/client/.eslintrc.js');

  return gulp.src(['src/client/**.js', 'src/client/**.jsx'])
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
})

/* Lint CSS */
gulp.task('lint:css', () => {
  const colorguard = require('gulp-colorguard');
  const stylelint = require('gulp-stylelint');

  return gulp.src('src/**.css')
    .pipe(colorguard())
    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true},
      ],
    }));
});
