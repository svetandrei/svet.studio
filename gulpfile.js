const {src, dest, series, watch} = require('gulp');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-imagemin');
const uglify = require('gulp-uglify-es').default;
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const mode = require('gulp-mode')();
const sass = require('gulp-sass')(require('sass'));
const browserify = require('browserify');
const babelify = require('babelify');
const browserSync = require('browser-sync').create();
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

const clean = () =>{
  return del(['dist']);
}

const resources = () => {
  return src('src/resources/**')
    .pipe(dest('dist'))
}

const styles = () => {
  return src('src/styles/*.scss')
    .pipe(mode.development(sourcemaps.init()))
    .pipe(sass({
      includePaths: ['node_modules/normalize.css']
    }))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(mode.development(sourcemaps.write()))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

const fonts = () => {
  return src('src/fonts/**/*')
    .pipe(dest('dist/fonts'))
}

const htmlminify = () => {
  return src('src/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

const svgSprites = () => {
  return src('src/images/svg/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('dist/images'))
}

const images = () => {
  return src([
    'src/images/**/*.png',
    'src/images/**/*.gif',
    'src/images/**/*.jpeg',
    'src/images/**/*.jpg',
    'src/images/*.svg',
  ])
    .pipe(image())
    .pipe(dest('dist/images'))
}

const scripts = () => {
  return browserify({
    entries: ['src/js/script.js'],
    debug: true,
    transform: [
      babelify.configure({ presets: ['@babel/preset-env'] }),
    ],
  })
  .bundle()
  .pipe(source('script.js'))
  .pipe(buffer())
  .pipe(uglify().on('error', notify.onError()))
  .pipe(mode.development(sourcemaps.init({loadMaps: true})))
  .pipe(concat('app.js'))
  .pipe(mode.development(sourcemaps.write('.')))
  .pipe(dest('dist'))
  .pipe(browserSync.stream());
}

const wathcFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist',
    }
  })
}

watch('src/**/*.html', htmlminify);
watch('src/styles/*.scss', styles);
watch('src/images/svg/**/*.svg', svgSprites);
watch('src/js/**/*.js', scripts);
watch('src/resources/**', resources);
watch('src/images/*', images);


exports.styles = styles;
exports.scripts = scripts;
exports.htmlminify = htmlminify;
exports.dev = series(clean, resources, fonts, styles, scripts, svgSprites, htmlminify, images, wathcFiles);
exports.prod = series(resources, fonts, styles, scripts, htmlminify, svgSprites, images);
