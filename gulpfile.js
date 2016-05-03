
'use strict';

// dependencies -----------------------------------------------------------

    var gulp        = require('gulp'),
        babelify    = require('babelify'),
        browserify  = require('browserify'),
        browserSync = require('browser-sync'),
        buffer      = require('vinyl-buffer'),
        changed     = require('gulp-changed'),
        csso        = require('gulp-csso'),
        del         = require('del'),
        notify      = require('gulp-notify'),
        reload      = browserSync.reload,
        sass        = require('gulp-sass'),
        source      = require('vinyl-source-stream'),
        sourcemaps  = require('gulp-sourcemaps'),
        uglify      = require('gulp-uglify'),
        watchify    = require('watchify');

// project config ---------------------------------------------------------

    var p = {
        html:           './src/index.html',
        jsx:            './src/scripts/client.jsx',
        scss:           './src/sass/**/*.scss',
        scssmain:       './src/sass/main.scss',
        libs:           './src/scripts/libs/*',
        assets:         './src/assets/*',
        favicon:        './src/favicon.ico',
        faviconUpload:   './src/favicon-upload.png',
        fonts:          './src/sass/fonts/*',
        bundle:         'app.min.js',
        md5bundle:      'md5worker.min.js',

        dist:           'dist',
        distCss:        'dist/css',
        distAssets:     'dist/assets',
        distFonts:      'dist/fonts'
    };

// primary tasks ----------------------------------------------------------

    gulp.task('build', [], function() {
        process.env.NODE_ENV = 'production';
        gulp.start(['styles', 'copy', 'buildApp']);
    });

    gulp.task('watch', [], function() {
        gulp.start(['watchStyles', 'watchApp', 'styles', 'copy', 'browserSync']);
    });

    gulp.task('default',['watch'], function() {
        console.log('Running"');
    });

// tasks ------------------------------------------------------------------

    // clean before build
    gulp.task('clean', function(cb) {
          del(['dist'], cb);
    });

    // server and sync changes
    gulp.task('browserSync', function() {
        browserSync.init({
            server: './dist',
            port: 9876
        });
    });

    // copy
    gulp.task('copy', function () {
        gulp.src(p.html).pipe(gulp.dest(p.dist));
        gulp.src(p.favicon).pipe(gulp.dest(p.dist));
        gulp.src(p.faviconUpload).pipe(gulp.dest(p.dist));
        gulp.src(p.assets).pipe(gulp.dest(p.distAssets));
        gulp.src(p.fonts).pipe(gulp.dest(p.distFonts));
    });

    // watch for changes
    gulp.task('watchApp', function() {
        var bundler = watchify(browserify(p.jsx, watchify.args));
        function rebundle() {
            return bundler
                .bundle()
                .on('error', notify.onError())
                .pipe(source(p.bundle))
                .pipe(gulp.dest(p.dist))
                .pipe(reload({stream: true}));
        }
        bundler.transform(babelify).on('update', rebundle);
        return rebundle();
    });

    // bundle js
    gulp.task('buildApp', function() {
        browserify(p.jsx)
            .transform(babelify)
            .bundle()
            .pipe(source(p.bundle))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(p.dist));
    });

    // compile & minify scss
    gulp.task('styles', function() {
        return gulp.src(p.scssmain)
            .pipe(changed(p.distCss))
            .pipe(sass({errLogToConsole: true}))
            .on('error', notify.onError())
            // .pipe(csso())
            .pipe(gulp.dest(p.distCss))
            .pipe(reload({stream: true}));
    });

    // watch styles
    gulp.task('watchStyles', function() {
        gulp.watch(p.scssmain, ['styles']);
        gulp.watch(p.scss, ['styles']);
    });
