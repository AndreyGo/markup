var gulp = require('gulp'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    util = require('gulp-util');
    require('gulp-grunt')(gulp, {
        prexif: '',
        verbose: true
    });

// Собираем иконки в спрайт
gulp.task('sprite', function(){
    gulp.start('grunt-sprites');
});

// Собираем Stylus
gulp.task('stylus', function(){
    gulp.src('./app/styl/style.styl')
    .pipe(stylus()).on('error', console.log)
    .pipe(autoprefixer())
    .pipe(gulp.dest('./public/css'));
});

// Собираем html из Jade
gulp.task('jade', function(){
    gulp.src(['./app/views/*.jade', '!./app/views/_*.jade'])
        .pipe(jade({
            pretty: true
        }))
        .on('error', console.log)
    .pipe(gulp.dest('./public/'))
});

// Собираем plugins.js
gulp.task('plugins', function(){
    gulp.src(['./app/js/plugins/**.js'])
        .pipe(uglify())
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest('./public/js'))
});

// Копируем app.js
gulp.task('app', function(){
  gulp.src('./app/js/app.js')
    .pipe(gulp.dest('./public/js/'))
});

// Копируем изображения, кроме папки icons.
gulp.task('images', function(){
    gulp.src(['./app/img/**', '!./app/img/icons{,/**}',])
        .pipe(gulp.dest('./public/img'))
});

// Копируем шрифты
gulp.task('fonts', function(){
    gulp.src('./app/fonts/**')
        .pipe(gulp.dest('./public/fonts/'));
});

// Запускаем livereload
gulp.task('browser-sync', function(){
    browserSync.init(['./public/*.html', './public/css/*.css', './public/js/**/*.js', './public/img/*'], {
        server: {
            host: 'localhost',
            baseDir: './public'
        }
    });
});

// Чистим папку
gulp.task('rm', function(){
    gulp.src('./build/')
        .pipe(clean());
});

// Запуск сервера разработки gulp watch
gulp.task('watch', function(){
    gulp.start('stylus');
    gulp.start('images');
    gulp.start('app');
    gulp.start('plugins');
    gulp.start('browser-sync');

    gulp.watch('app/styl/**/*.styl', ['stylus']);
    gulp.watch('app/img/**/*', ['images']);
    gulp.watch('app/js/**/*.js', ['app', 'plugins']);
});
