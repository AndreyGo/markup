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

// Собираем JS
gulp.task('js', function(){
    gulp.src(['./app/js/**/*.js', '!./app/js/vendor/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./public/js'))
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

    // Предварительная сборка проекта
    gulp.src('./app/js/vendor/**/*.js')
        .pipe(gulp.dest('./public/js/vendor'));

    gulp.start('stylus');
    gulp.start('jade');
    gulp.start('fonts');
    gulp.start('images');
    gulp.start('browser-sync');

    gulp.watch('app/styl/**/*.styl', ['stylus']);
    gulp.watch('app/views/**/*.jade', ['jade']);
    gulp.watch('app/js/**/*', ['js']);
    gulp.watch('app/img/**/*', ['images']);
    gulp.watch('app/img/icons/*.png', ['sprite']);
});

gulp.task('build', function(){

    // Копируем все изображения
    gulp.src('./app/img/**/*')
        .pipe(gulp.dest('./build/img'));

    // Копируем шрифты
    gulp.src('./app/fonts/**')
      .pipe(gulp.dest('./build/fonts'));

    // css
    gulp.src('./app/styl/style.styl')
    .pipe(stylus()).on('error', console.log)
    .pipe(autoprefixer())
    .pipe(gulp.dest('./build/css'));

    // jade
    gulp.src(['./app/views/*.jade', '!./app/views/_*.jade'])
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./build/'));

    // Main JS + plugins
    gulp.src(['./app/js/**/*.js', '!./app/js/vendor/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

    // Vendor plugins
    gulp.src('./app/js/vendor/**/*.js')
        .pipe(gulp.dest('./build/js/vendor'));
});
