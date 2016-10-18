'use strict';

const gulpUtil = require('gulp-util');

const babel = require('gulp-babel');
const childProcess = require('child_process');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');

const UGLIFYOPTIONS = {
  mangle: true,
  compress: true,
  output: {
    comments: false
  }
};

const MINIFIED_JS = 'angular-slide-out-panel.min.js';
const MINIFIED_CSS = 'angular-slide-out-panel.min.css';

const RELEASE = gulpUtil.env.release;
const RELEASE_DIR = 'release';

/**
 * @desc Clean the build directory
 */
gulp.task('clean', next => {
  childProcess.exec(`rm -rf ${RELEASE_DIR}`, next);
});

/**
 * @desc Minify javascript files
 */
gulp.task('js', () => {
  return gulp.src([
      `./src/js/app.js`,
      `./src/**/*.js`
    ])
    .pipe(babel({ //convert ES6 -> ES5
      presets: ['es2015']
    }))
    .pipe(gulpIf(RELEASE, uglify(UGLIFYOPTIONS)))
    .pipe(concat(MINIFIED_JS))
    .pipe(gulp.dest(`${RELEASE_DIR}/js`));
});

/**
 * @desc Copy and minify CSS
 */
gulp.task('css', () => {
  return gulp.src('src/css/*.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename(MINIFIED_CSS))
    .pipe(gulp.dest(`${RELEASE_DIR}/css`));
});

gulp.task('release', () => {
  return runSequence('clean', 'js', 'css');
});

gulp.task('build', () => {
  return runSequence('release', 'watch');
});

gulp.task('watch', () => {
  return gulp.watch([
    './src/**/*.js',
    './src/**/*.css'
  ], ['release']);
});
