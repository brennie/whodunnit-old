'use strict';

const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const del = require('del');
const gulp = require('gulp');
const changed = require('gulp-changed');
const gutil = require('gulp-util');
const webpack = require('webpack');
const yargs = require('yargs');

const appConfig = require('./config');

const CLIENT_SRC = path.join(__dirname, 'src', 'client');
const LIB_SRC = path.join(__dirname, 'src', 'lib');
const SERVER_SRC = path.join(__dirname, 'src', 'server');

const PID_FILE = path.join('.', '.server.pid');

const argParser = yargs
  .boolean('disable-browsersync');

const args = argParser.argv;

let useBrowserSync = !args.disableBrowsersync;
let browserSync = null;

if (useBrowserSync) {
  try {
    const bs = require('browser-sync');
    browserSync = bs.create();
  } catch (e) {
    gutil.log('Could not import browser-sync');
    useBrowserSync = false;
  }
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/*
 * Building tasks.
 */

/* Clean the build directory. */
gulp.task('clean', () => {
  return del(['dist/**/*']);
});

/* Build client HTML. */
gulp.task('build:client:html', () => {
  const dest = path.join(__dirname, 'dist', 'client');

  return gulp
    .src(`${CLIENT_SRC}/**/*.html`)
    .pipe(changed(dest))
    .pipe(gulp.dest(dest));
});

/* Build the client JS. */
gulp.task('build:client:js', done => {
  const webpackConfig = require('./webpack.config');

  webpack(webpackConfig, (err, stats) => {
    if (err)
      throw new gutil.PluginError('build:client:js', err);

    gutil.log('[build:client:js]', stats.toString({
      chunks: false,
      colors: true,
    }));

    done();
  });
});

gulp.task('build:client:fonts', () => {
  const dest = path.join(__dirname, 'dist', 'client', 'static', 'fonts');
  return gulp
    .src(path.join('node_modules', 'font-awesome', 'fonts', '*'))
    .pipe(changed(dest))
    .pipe(gulp.dest(dest));
});

/* Build the client. */
gulp.task('build:client', gulp.parallel('build:client:html', 'build:client:js', 'build:client:fonts'));

/* Build the lib (for the server). */
gulp.task('build:lib', () => {
  const babel = require('gulp-babel');
  const babelConfig = require('./.babelrc');
  const dest = path.join(__dirname, 'dist', 'lib');

  return gulp
    .src(`${LIB_SRC}/**/*.js`)
    .pipe(changed(dest))
    .pipe(babel(babelConfig))
    .pipe(gulp.dest(dest));
});

/* Build the server. */
gulp.task('build:server', gulp.parallel('build:lib', () => {
  const babel = require('gulp-babel');
  const babelConfig = require('./.babelrc');
  const dest = path.join(__dirname, 'dist', 'server');

  return gulp
    .src(`${SERVER_SRC}/**/*.js`)
    .pipe(changed(dest))
    .pipe(babel(babelConfig))
    .pipe(gulp.dest(dest));
}));

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

gulp.task('serve', gulp.series(gulp.parallel('build:server', 'build:client:html', 'build:client:fonts'), done => {
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
        if (exitCode)
          throw new gutil.PluginError('serve', 'The server process quit unexpectantly.');
      });
  };

  const stopServer = (onExit=null) => {
    gutil.log('[serve]', `Stopping ${process.env.NODE_ENV} server..`);

    serverProc
      .on('exit', () => {
        if (onExit && typeof onExit === 'function')
          onExit();
      })
      .kill();

    serverProc = null;
    del.sync([PID_FILE]);
  };

  startServer();

  /* Ensure we shut down the server process when we ^C. */
  process.on('SIGINT', () => {
    if (serverProc)
      stopServer();

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
      const connectHistoryApiFallback = require('connect-history-api-fallback');
      browserSync.init({
        middleware: [connectHistoryApiFallback()],
        notify: {
          styles: {
            top: 'auto',
            bottom: 0,
            'borderBottomLeftRadius': 'none',
          },
        },
        open: false,
        proxy: `localhost:${appConfig.port}`,
      });
    } else if (useBrowserSync) {
      /* We only need to do a full reload if we've built any non-css files.
       * Otherwise, we can just tell BrowserSync to inject the compiled CSS.
       */
      const needFullReload = stats
        .compilation
        .modules
        .some(module => module.built && module.resource && !module.resource.match(/\.css(\.map)?$/));

      if (needFullReload)
        browserSync.reload();
      else
        browserSync.reload('*.css');
    }

    firstRun = false;
  });

  gulp
    .watch(`${SERVER_SRC}/**/*.js`)
    .on('change', gulp.series('build:server', done => stopServer(() => {
      startServer();
      done();
    })));

  gulp
    .watch(`${CLIENT_SRC}/**/*.html`)
    .on('change', gulp.series('build:client:html', done => {
      if (useBrowserSync)
        browserSync.reload();

      done();
    }));
}));


/*
 * Linting tasks.
 */

/* Lint client JS. */
gulp.task('lint:js:client', () => {
  const eslint = require('gulp-eslint');

  return gulp
    .src([
      `${CLIENT_SRC}/**/*.js`,
      `${CLIENT_SRC}/**/*.jsx`,
      `${LIB_SRC}/**/*.js`,
    ])
    .pipe(eslint({
      configFile: `${CLIENT_SRC}/.eslintrc.js`,
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/* Lint server JS. */
gulp.task('lint:js:server', () => {
  const eslint = require('gulp-eslint');

  return gulp
    .src([
      `${SERVER_SRC}/**/*.js`,
      `${LIB_SRC}/**/*.js`,
    ])
    .pipe(eslint({
      configFile: `${CLIENT_SRC}/.eslintrc.js`,
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/* Lint configuration files. */
gulp.task('lint:js:config', () => {
  const eslint = require('gulp-eslint');

  return gulp
    .src([
      '*.js',
      '.*.js',
    ])
    .pipe(eslint({
      configFile: `${SERVER_SRC}/.eslintrc.js`,
    }))
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
      require('postcss-color-function'),
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

/* Run server unit tests. */
gulp.task('test:server', gulp.series('build:server', () => {
  const tape = require('gulp-tape');
  const tapeConfig = {};

  if (!process.env.hasOwnProperty('CI')) {
    try {
      tapeConfig.reporter = require('faucet')();
    } catch (e) {}
  }

  return gulp
    .src('dist/server/test/index.js')
    .pipe(tape(tapeConfig));
}));

/* Run all unit tests. */
gulp.task('test', gulp.series('test:server'));

/* Run the server as the default task. */
gulp.task('default', gulp.series('serve'));
