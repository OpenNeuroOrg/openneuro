'use strict';

// dependencies -----------------------------------------------------------
    var gulp = require('gulp'),
        changed = require('gulp-changed'),
        sass = require('gulp-sass'),
        csso = require('gulp-csso'),
        autoprefixer = require('gulp-autoprefixer'),
        browserify = require('browserify'),
        watchify = require('watchify'),
        source = require('vinyl-source-stream'),
        buffer = require('vinyl-buffer'),
        babelify = require('babelify'),
        uglify = require('gulp-uglify'),
        del = require('del'),
        notify = require('gulp-notify'),
        browserSync = require('browser-sync'),
        sourcemaps = require('gulp-sourcemaps'),
        reload = browserSync.reload;

// project config ---------------------------------------------------------

    var p = {
        jsx: './src/scripts/app.jsx',
        scss: './src/sass/main.scss',
        bundle: 'app.js',
        distJs: 'dist/js',
        distCss: 'dist/css'
    };

// primary tasks ----------------------------------------------------------

    gulp.task('watch', ['clean'], function() {
        gulp.start(['browserSync', 'watchTask', 'watchify', 'styles']);
    });

    gulp.task('build', ['clean'], function() {
        process.env.NODE_ENV = 'production';
        gulp.start(['browserify', 'styles']);
    });

    gulp.task('default', function() {
        console.log('Run "gulp watch or gulp build"');
    });

// tasks ------------------------------------------------------------------

    // clean before build
    gulp.task('clean', function(cb) {
          del(['dist'], cb);
    });

    // server and sync changes
    gulp.task('browserSync', function() {
        browserSync({
            server: {
                baseDir: './'
            }
        });
    });

    // watch for changes
    gulp.task('watchify', function() {
        var bundler = watchify(browserify(p.jsx, watchify.args));
        function rebundle() {
            return bundler
                .bundle()
                .on('error', notify.onError())
                .pipe(source(p.bundle))
                .pipe(gulp.dest(p.distJs))
                .pipe(reload({stream: true}));
        }
        bundler.transform(babelify).on('update', rebundle);
        return rebundle();
    });

    // bundle js
    gulp.task('browserify', function() {
        browserify(p.jsx)
            .transform(babelify)
            .bundle()
            .pipe(source(p.bundle))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(p.distJs));
    });

    // compile & minify scss
    gulp.task('styles', function() {
        return gulp.src(p.scss)
            .pipe(changed(p.distCss))
            .pipe(sass({errLogToConsole: true}))
            .on('error', notify.onError())
            .pipe(autoprefixer('last 1 version'))
            .pipe(csso())
            .pipe(gulp.dest(p.distCss))
            .pipe(reload({stream: true}));
    });

    // watch styles
    gulp.task('watchTask', function() {
        gulp.watch(p.scss, ['styles']);
    });
