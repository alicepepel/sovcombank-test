import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';
import browser from 'browser-sync';


// Styles

export const styles = () => {
  return gulp.src('src/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('out/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('out'))
    .pipe(browser.stream());
}

// Scripts

const scripts = () => {
  return gulp.src('src/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('out/js'))
}

// Images

const optimizeImages = () => {
  return gulp.src(['src/img/**/*.{jpg,png}', 'src/img/*.{jpg,png}'])
  .pipe(squoosh())
  .pipe(gulp.dest('out/img'))
}

const copyImages = () => {
  return gulp.src(['src/img/**/*.{jpg,png}', 'src/img/*.{jpg,png}'])
  .pipe(gulp.dest('out/img'))
}

// SVG

const svg = () =>
  gulp.src(['src/img/*.svg', '!src/img/svg/icons/*.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('out/img'));

// Copy

const copy = (done) => {
  gulp.src([
    'src/fonts/**/*.{woff2,woff}',
    'src/img/favicons/*.{png,svg}',
    'src/img/*.{mp4}',
    'src/*.ico',
    'src/*.webmanifest',


  ], {
    base: 'src'
  })
    .pipe(gulp.dest('out'))
  done();
}

// Clean

const clean = () => {
  return del('out');
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'out'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('src/less/**/*.less', gulp.series(styles));
  gulp.watch('src/js/script.js', gulp.series(scripts));
  gulp.watch('src/*.html', gulp.series(html));
  gulp.watch('src/img/*.{jpg,png}', gulp.series(copyImages))
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg
  ),
);

// Default

export default gulp.series(
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg
  ),
  gulp.series(
    server,
    watcher
  )
);
