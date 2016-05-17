var gulp = require('gulp');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');

var include = require('./include.json');

gulp.task('build-release', function() {
	gulp.src(include)
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())
			.pipe(concat('perkogine.js'))
			.pipe(uglify())
			.pipe(gulp.dest('build'));
});

gulp.task('build-dev', function() {
	gulp.src(include)
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())
			.pipe(concat('perkogine-dev.js'))
			.pipe(gulp.dest('build'));
});

gulp.task('watch-release', function() {
	gulp.watch(include, ['build-release']);
});

gulp.task('watch-dev', function() {
	gulp.watch(include, ['build-dev']);
});

gulp.task('watch', ['watch-release', 'watch-dev']);
gulp.task('build', ['build-release', 'build-dev']);
gulp.task('all', ['build', 'watch'])