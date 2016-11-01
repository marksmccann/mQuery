var gulp = require('gulp');
var minify = require('gulp-minify');

gulp.task('compress', function() {
  gulp.src('src/mquery.js')
    .pipe(minify({ext:{min:'.min.js'}}))
    .pipe(gulp.dest('dist'))
});

gulp.task('default',function() {
    gulp.watch('src/mquery.js',['compress']);
});
