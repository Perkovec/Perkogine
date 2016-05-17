var gulp = require('gulp');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');

var include = require('./include.json');

gulp.task('build-release', function (){
	gulp.src(include)
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())
			.pipe(concat('perkogine.js'))
			.pipe(uglify())
			.pipe(gulp.dest('build'));
});

gulp.task('build-dev', function (){
	gulp.src(include)
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())
			.pipe(concat('perkogine-dev.js'))
			.pipe(gulp.dest('build'));
});

gulp.task('build', ['build-release', 'build-dev']);