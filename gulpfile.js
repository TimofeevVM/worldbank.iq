var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    browserSync     = require('browser-sync').create(),
    clean           = require('gulp-clean'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify-es').default,
    minifyCSS       = require('gulp-minify-css');



gulp.task('sass', function(){
    return gulp.src('src/sass/**/*.+(scss|sass)')
        .pipe(sass())
        .pipe(gulp.dest('src/css/'))
        .pipe(browserSync.stream());
});

gulp.task('browser-sync',function(){
    browserSync.init({
        server: {
            baseDir: 'src',
        },
        single:true,
        cors:true,
        notify:false,
        files:'*'
    });
});

gulp.task('watch', function(){
    gulp.watch('src/sass/**/*.+(scss|sass)',gulp.series('sass'));
    gulp.watch("src/**/*.html").on('change', browserSync.reload);
    gulp.watch("src/**/*.js").on('change', browserSync.reload);
});


gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('build',function(){

});




gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        //.pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('styles', function() {
    return gulp.src(["src/css/**/*.css"])
        .pipe(concat('main.min.css'))
        /*.pipe(minifyCSS({
            keepBreaks: true
        }))*/
        .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.parallel('browser-sync', 'watch', 'sass'));
