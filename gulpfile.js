var proxy = '';
var dev = './';
var public = './public/';

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var del          = require('del');
var sass         = require('gulp-sass');
var rollup       = require('gulp-rollup');
var buble        = require('rollup-plugin-buble');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var plumber      = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss    = require('gulp-clean-css');
var sourcemaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync').create();
var twig = require('gulp-twig');


//Twig
/*gulp.task('templates', function () {
    return gulp.src('src/!*.twig') // lance l'analyseur de template Twig sur tous les fichiers .html du répertoire "src"
        .pipe(twig())
        .pipe(gulp.dest('./')) // affiche les fichiers HTML rendus dans le répertoire "dist"
        .pipe(browserSync.reload({ stream: true }));
});*/

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(public+'css/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 5 version', 'ie 8-11']
        }))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(public+'styles'))
        .pipe(browserSync.stream());
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([public+'scripts/*.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(rollup({
            input: public + 'scripts/main.js',
            format: 'es',
            plugins: [ buble() ]
        }))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest(public+'scripts'))
        .pipe(rename('bundle.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(public+'scripts'))
        .pipe(browserSync.stream());
});

// Watch Files For Changes
/*
gulp.task('watch', function() {

    if(proxy){
        browserSync.init({
            proxy: proxy
        });
    } else {
        browserSync.init({
            server: {
                baseDir: public
            }
        });
    }

    gulp.watch(dev+'styles/!*.scss', ['sass']);
    gulp.watch([dev+'scripts/!*.js'], ['scripts']);
    gulp.watch(['src/!*.twig'], ['templates']);
    gulp.watch(['*.html']).on('change', browserSync.reload);
});
*/
