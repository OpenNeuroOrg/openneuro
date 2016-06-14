'use strict';

// dependencies -----------------------------------------------------------

var gulp        = require('gulp'),
    babelify    = require('babelify'),
    browserify  = require('browserify'),
    browserSync = require('browser-sync'),
    buffer      = require('vinyl-buffer'),
    CacheBuster = require('gulp-cachebust'),
    cachebust   = new CacheBuster(),
    changed     = require('gulp-changed'),
    del         = require('del'),
    envify      = require('gulp-envify'),
    gulpif      = require('gulp-if'),
    rewrite     = require('connect-history-api-fallback'),
    notify      = require('gulp-notify'),
    reload      = browserSync.reload,
    sass        = require('gulp-sass'),
    source      = require('vinyl-source-stream'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    watchify    = require('watchify');

// project config ---------------------------------------------------------

var p = {
    html:       './src/index.html',
    jsx:        './src/scripts/client.jsx',
    scss:       './src/sass/**/*.scss',
    scssmain:   './src/sass/main.scss',
    assets:     './src/assets/*',
    bundle:     'app.min.js',

    dist:       'dist',
    distTemp:   'dist/temp',
    distAssets: 'dist/assets',

    env:        'prod'
};

// primary tasks ----------------------------------------------------------

gulp.task('build', ['styles', 'buildApp'], function() {
    gulp.start(['copy']);
});

gulp.task('watch', [], function() {
    p.env = 'dev';
    gulp.start(['watchStyles', 'watchApp', 'styles', 'copy', 'browserSync']);
});

gulp.task('default',['watch']);

// deployment build -------------------------------------------------------

// serve and sync changes
gulp.task('browserSync', function() {
    browserSync.init({
        server: './dist',
        port: 9876,
        middleware: rewrite()
    });
});

// copy
gulp.task('copy', function () {
    if (p.env === 'prod') {
        del(['dist/*.js', 'dist/*.map', 'dist/*.html', 'dist/*.css']).then(function () {
            gulp.src(p.html).pipe(cachebust.references()).pipe(gulp.dest(p.dist));
            gulp.src(p.assets).pipe(gulp.dest(p.distAssets));
            gulp.src('dist/temp/*').pipe(gulp.dest(p.dist))
                .on('end', function () {
                    del(['dist/temp']);
                });
        });
    } else {
        gulp.src(p.html).pipe(gulp.dest(p.dist));
        gulp.src(p.assets).pipe(gulp.dest(p.distAssets));
    }
});

// bundle js
gulp.task('buildApp', function(cb) {
    process.env.NODE_ENV = 'production';
    browserify(p.jsx)
        .transform(babelify)
        .bundle()
        .pipe(source(p.bundle))
        .pipe(buffer())
        .pipe(envify(process.env))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(cachebust.resources())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(p.distTemp))
        .on('end', cb);
});

// compile & minify scss
gulp.task('styles', function() {
    return gulp.src(p.scssmain)
        .pipe(changed(p.dist))
        .pipe(sass({errLogToConsole: true}))
        .on('error', notify.onError())
        .pipe(gulpif(p.env === 'prod', cachebust.resources()))
        .pipe(gulpif(p.env === 'prod', gulp.dest(p.distTemp), gulp.dest(p.dist)))
        .pipe(reload({stream: true}));
});

// development build ------------------------------------------------------

// watch for js changes
gulp.task('watchApp', function() {
    var bundler = watchify(browserify(p.jsx, watchify.args));
    function rebundle() {
        return bundler
            .bundle()
            .on('error', notify.onError())
            .pipe(source(p.bundle))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest(p.dist))
            .pipe(reload({stream: true}));
    }
    bundler.transform(babelify).on('update', rebundle);
    return rebundle();
});

// watch styles
gulp.task('watchStyles', function() {
    gulp.watch(p.scssmain, ['styles']);
    gulp.watch(p.scss, ['styles']);
});