'use strict';

const browserSync = require('browser-sync').create();
const del = require('del');
const fork = require('child_process').fork;
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const yargs = require('yargs');


const production = yargs
  .boolean('production')
  .argv
  .production;

const nodeEnv = production ? 'production' : 'development';

const webpackConfig = require('./webpack.config');

webpackConfig.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(nodeEnv),
    }
  })
);

if (production) {
  webpackConfig.plugins.push(new webpack.optimize.DedupePlugin());
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

const appConfig = require('./config');


gulp.task('default', ['serve']);


/*
 * Server tasks.
 */

/* Run the server.
 *
 * The server will restart whenever source files are modified.
 *
 * This does not depend on `build:client` because that would end building the
 * client JavaScript twice.
 */
{
  let serverProc = null;
  let firstRun = true;

  gulp.task('serve', ['build:server', 'build:client:html'], () => {
    const startServer = () => {
      const env = Object.assign({}, process.env, {
        NODE_ENV: nodeEnv,
      });

      webpack(webpackConfig, (err, stats) => {
        if (err) {
          /* If we don't kill the server here, it will keep running in the
           * background and we will have to kill it manually to run `gulp serve`
           * again.
           */
          if (serverProc) {
            serverProc.kill();
          }

          throw new gutil.PluginError('serve', err);
        }

        gutil.log('[serve]', stats.toString({
          colors: true,
          chunks: false,
        }));

        /* Only use Browsersync when we are running the development server. */
        if (!production) {
          if (firstRun) {
            gutil.log('[serve]', 'Starting Browsersync...');
            browserSync.init({proxy: `localhost:${appConfig.port}`});
            firstRun = false;
          } else {
            browserSync.reload();
          }
        }
      });

      gutil.log('[serve]', `Starting ${nodeEnv} server...`);
      serverProc = fork('dist/server/index.js', [], {env});

      /* Live-reload the server whenever the source changes. */
      if (!production){
        gulp.watch('./src/server/**/*.js', ['serve']);
        gulp.watch('./src/client/**/*.html', ['build:client:html']);
      }
    };

    if (!production && firstRun) {
      webpackConfig.watch = true;
    }

    /* If the server is already running, kill it and restart it.*/
    if (serverProc) {
      gutil.log('[serve]', `Stopping ${nodeEnv} server...`);
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

/* Clean the build directory. */
gulp.task('clean', done => {
  del(['dist/**/*'], done);
});

/* Build everything. */
gulp.task('build', ['build:server', 'build:client']);

/* Build the server-side JS. */
gulp.task('build:server', () => {
  const babel = require('gulp-babel');
  const babelConfig = require('./.babelrc.js');

  return gulp.src('src/server/**.js')
    .pipe(babel(babelConfig))
    .pipe(gulp.dest('dist/server'));
});

/* Build the client. */
gulp.task('build:client', ['build:client:html', 'build:client:js']);

/* Build the client-side HTML
 *
 * This just copies all HTML to the dist/ directory.
 */
gulp.task('build:client:html', () => {
  const pipeline = gulp
    .src('./src/client/**/*.html')
    .pipe(gulp.dest('./dist/client/'));

  if (browserSync.active) {
    browserSync.reload();
  }

  return pipeline;
});

gulp.task('build:client:js', done => {
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('build:client:js', err);
    }

    gutil.log('[build:client:js]', stats.toString({
      colors: true,
      chunks: false,
    }));
    done();
  });
});


/*
 * Linting tasks.
 */

/* Lint everything. */
gulp.task('lint', ['lint:js', 'lint:css']);

/* Lint all JS. */
gulp.task('lint:js', ['lint:js:client', 'lint:js:server', 'lint:js:config']);

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

  return gulp.src(['src/client/**/*.js', 'src/client/**/*.jsx'])
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/* Lint the config JS. */
gulp.task('lint:js:config', () => {
  const eslint = require('gulp-eslint');
  const eslintConfig = require('./src/server/.eslintrc.js');

  return gulp.src(['*.js', '.*.js'])
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/* Lint CSS */
gulp.task('lint:css', ['lint:css:colorguard', 'lint:css:stylelint']);

/* Lint CSS with colorguard.
 *
 * This requires running the CSS through our full postcss suite so that
 * colorguard can parse it.
 */
gulp.task('lint:css:colorguard', () => {
  const colorguard = require('gulp-colorguard');
  const postcss = require('gulp-postcss');

  return gulp.src('src/client/**/*.css')
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
  const postCSS = require('gulp-postcss');
  const stylelint = require('gulp-stylelint');

  return gulp.src('src/**/*.css')
    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true},
      ],
    }));
});
