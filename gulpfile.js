var gulp = require('gulp'),
    plugin = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    });

gulp.task('serve', function () {
    gulp.src('.')
        .pipe(plugin.webserver({
            livereload: false,
            open: true,
            fallback: 'index.html'
        }));
});

gulp.task('serve-live', function () {
    gulp.src('.')
        .pipe(plugin.webserver({
            livereload: true,
            open: true,
            fallback: 'index.html'
        }));
});

gulp.task('default', ['serve']);