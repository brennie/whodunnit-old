'use strict';

const child_process = require('child_process');
const fs = require('fs');

const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const yargs = require('yargs');

const appConfig = require('./config');


const SERVER_SRC = './src/server';
const CLIENT_SRC = './src/client';
const PID_FILE = './.server.pid';

const argParser = yargs
  .boolean('disable-browsersync');

const args = argParser.argv;
const useBrowserSync = !args.disableBrowsersync;
const browserSync = useBrowserSync ? require('browser-sync').create() : null;


process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/*
 * Building tasks.
 */

/* Clean the build directory. */
gulp.task('clean', done => {
  return del(['dist/**/*']);
});

/* Build client HTML. */
gulp.task('build:client:html', () => {
  return gulp
    .src(`${CLIENT_SRC}/**/*.html`)
    .pipe(gulp.dest('./dist/client/'));
});

/* Build the client JS. */
gulp.task('build:client:js', done => {
  const webpackConfig = require('./webpack.config');

  webpack(webpackConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('build:client:js', err);
    }

    gutil.log('[build:client:js]', stats.toString({
      chunks: false,
      colors: true,
    }));

    done();
  });
});

/* Build the client. */
gulp.task('build:client', gulp.parallel('build:client:html', 'build:client:js'));

/* Build the server. */
gulp.task('build:server', () => {
  const babel = require('gulp-babel');
  const babelConfig = require('./.babelrc');

  return gulp
    .src(`${SERVER_SRC}/**/*.js`)
    .pipe(babel(babelConfig))
    .pipe(gulp.dest('dist/server'));
});

/* Build the server and client. */
gulp.task('build',
  gulp.series(done => {
    process.env.NODE_ENV = 'production';
    done();
  },
  gulp.parallel('build:server', 'build:client')));

/*
 * Server tasks
 */

/* Run the server.
 *
 * The development server will restart whenver the backend file are modified.
 *
 * The front-end will reload when running in a development server with
 * Browsersync enabled.
 *
 * We intentionally do not depend on build:client ebcause that would result in
 * building the client JavaScript twice.
 */

gulp.task('serve', gulp.series(gulp.parallel('build:server', 'build:client:html'), done => {
  let firstRun = true;
  let serverProc;

  const startServer = () => {
    /* Check to see if a server is still running, e.g. from a previous crashed
     * `gulp serve` instance.
     */
    try {
      const pid = parseInt(fs.readFileSync(PID_FILE, {encoding: 'utf8'}));
      process.kill(pid);
      del.sync([PID_FILE]);
    } catch (e) {}

    gutil.log('[serve]', `Starting ${process.env.NODE_ENV} server on port: ${appConfig.port}...`);
    serverProc = child_process
      .fork('dist/server')
      .on('exit', exitCode => {
        if (exitCode) {
          throw new gutil.PluginError('serve', 'The server process quit unexpectantly.');
        }
      });
  };

  const stopServer = (onExit=null) => {
    gutil.log('[serve]', `Stopping ${process.env.NODE_ENV} server..`);

    serverProc
      .on('exit', () => {
        if (onExit && typeof onExit === 'function') {
          onExit();
        }
      })
      .kill();

    serverProc = null;
    del.sync([PID_FILE]);
  };

  startServer();

  /* Ensure we shut down the server process when we ^C. */
  process.on('SIGINT', () =>{
    if (serverProc) {
      stopServer();
    }

    done();
  });

  const webpackConfig = require('./webpack.config');
  webpackConfig.watch = true;
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      stopServer();
      throw new gutil.PluginError('serve', err);
    }

    gutil.log('[serve]', stats.toString({
      chunks: false,
      colors: true,
    }));

    if (useBrowserSync && firstRun) {
      browserSync.init({
        proxy: `localhost:${appConfig.port}`,
        notify: {
          styles: {
            top: 'auto',
            bottom: 0,
          },
        },
      });
    } else if (useBrowserSync) {
      browserSync.reload();
    }

    firstRun = false;
  });

  gulp
    .watch(`${SERVER_SRC}/**/*.js`)
    .on('change', gulp.series('build:server', () => stopServer(startServer)));

  gulp
    .watch(`${CLIENT_SRC}/**/*.js`)
    .on('change', gulp.series('build:client:html', () => {
      if (useBrowserSync) {
        browserSync.reload();
      }
    }));
}));


/*
 * Linting tasks.
 */

/* Lint client JS. */
gulp.task('lint:js:client', () => {
  const eslint = require('gulp-eslint');
  const eslintConfig = require(`${CLIENT_SRC}/.eslintrc`);

  return gulp
    .src('src/client/**/*.js')
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/* Lint server JS. */
gulp.task('lint:js:server', () => {
  const eslint = require('gulp-eslint');
  const eslintConfig = require(`${SERVER_SRC}/.eslintrc`);

  return gulp
    .src(`${SERVER_SRC}/**/*.js`)
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/* Lint configuration files. */
gulp.task('lint:js:config', () => {
  const eslint = require('gulp-eslint');
  const eslintConfig = require(`${SERVER_SRC}/.eslintrc.js`);

  return gulp
    .src(['*.js', '.*.js'])
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/* Lint all JS. */
gulp.task('lint:js', gulp.parallel('lint:js:client', 'lint:js:server', 'lint:js:config'));

/* Lint CSS with colorguard.
 *
 * This requires running the CSS through our full postcss suite so that
 * colorguard can parse it.
 */
gulp.task('lint:css:colorguard', () => {
  const colorguard = require('gulp-colorguard');
  const postcss = require('gulp-postcss');

  return gulp
    .src(`${CLIENT_SRC}/**/*.css`)
    .pipe(postcss([
      require('postcss-import'),
      require('postcss-simple-vars'),
      require('postcss-nested'),
      require('postcss-sass-colors'),
      require('autoprefixer')({browsers: 'last 2 versions'}),
    ]))
    .pipe(colorguard());
});

/* Lint CSS with stylelint. */
gulp.task('lint:css:stylelint', () => {
  const stylelint = require('gulp-stylelint');

  return gulp
    .src(`${CLIENT_SRC}/**/*.css`)
    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true},
      ],
    }));
});

/* Lint CSS. */
gulp.task('lint:css', gulp.parallel('lint:css:colorguard', 'lint:css:stylelint'));

/* Lint all the things. */
gulp.task('lint', gulp.parallel('lint:js', 'lint:css'));

/* Run the server as the default task. */
gulp.task('default', gulp.series('serve'));
