const gulp = require('gulp'),
  clean = require('gulp-clean'),
  runSequence = require('gulp-sequence');

const imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  imageminJpegtran = require('imagemin-jpegtran'),

  fileinclude = require('gulp-file-include'),

  gulpif = require('gulp-if'),
  uglify = require('gulp-uglify'),
  scss = require('gulp-sass'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),

  inlineImg = require('gulp-base64'),

  useref = require('gulp-useref'),

  inlinesource = require('gulp-inline-source'),

  path = require('path');

const gulpOpen = require('gulp-open'),
  connect = require('gulp-connect'),

  server = {
    path: 'dist/',
    port: 8899,
    host: '0.0.0.0'
  };

gulp.task('clean', () => {
  return gulp.src(['dist'])
    .pipe(clean());
});

gulp.task('image-min', () => {
  return gulp.src('src/img/**/*')
    .pipe(imagemin({
      progressive: false,
      optimizationLevel: 7,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant(), imageminJpegtran()],
    }))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('scss', () => {
  return gulp.src('src/css/*.scss')
    .pipe(scss({
      paths: [path.join(__dirname, 'css', 'includes')],
    }))
    .pipe(autoprefixer({
      browsers: ['>= 5%'],
      cascade: false,
    }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('css-base64', () => {
  return gulp.src('dist/css/*.css')
    .pipe(inlineImg({
      maxImageSize: 8 * 1024, // bytes
      debug: true,
    }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('useref', () => {
  return gulp.src(['dist/src/views/*'])
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', cleanCSS()))
    .pipe(gulp.dest('dist/html'));
});

gulp.task('source-inline', () => {
  return gulp.src([
    'dist/views/*',
  ])
    .pipe(inlinesource())
    .pipe(gulp.dest('dist/html'));
})
;

gulp.task('connect', () => {
  console.log('------ server start ------');
  connect.server({
    root: server.path,
    port: server.port,
    host: server.host,
    livereload: true,
  });
})
;

gulp.task('open', () => {
  gulp.src('')
    .pipe(gulpOpen({
      app: 'Google chrome',
      uri: 'http://localhost:8899/src/',
    }));
})
;

gulp.task('watch', () => {
  gulp.watch([
    'src/**/*',
  ], function (info, file) {
    if (info.path.match(/\.html$/)) {
      buildHtml(info.path);
    }
    if (info.path.match(/\.scss/)) {
      releaseScss('src/css/*.scss');
    }
    else {
      copyFileToDist(info.path);
    }
  });
})
;

gulp.task('init', () => {
  releaseScss([
    'src/css/*.scss',
  ]);
  buildHtml([
    'src/views/**/*',
  ]);
  copyFileToDist([
    'public/**/*',
    'src/js/**/*',
    'src/img/**/*',
    'src/font/**/*',
    'src/video/**/*',
  ]);
})
;

function copyFileToDist(src) {
  return gulp.src(src, { base: '.' })
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
}

function buildHtml(src) {
  return gulp.src(src, { base: '.' })
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
    }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
}

function releaseScss(src) {
  return gulp.src(src, { base: '.' })
    .pipe(scss({
      paths: [path.join(__dirname, 'css', 'includes')],
    }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
}

gulp.task('dev', runSequence('clean', 'init', ['connect', 'open', 'watch']));

gulp.task('release', runSequence('clean', 'init', 'image-min', 'useref', 'css-base64', 'source-inline'));
