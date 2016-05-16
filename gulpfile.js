var gulp = require('gulp');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');

gulp.task('build-release', function (){
	gulp.src('src/**')
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())
			.pipe(uglify())
			.pipe(concat('perkogine.js'))
			.pipe(gulp.dest('build'));
});

gulp.task('build-dev', function (){
	gulp.src('src/**')
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())
			.pipe(concat('perkogine-dev.js'))
			.pipe(gulp.dest('build'));
});

gulp.task('build', ['build-release', 'build-dev']);