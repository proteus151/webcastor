var gulp = require('gulp');
var babel = require('gulp-babel');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

// Generate browser code
gulp.task('browserify', function () {
	return browserify('./build/Castor.js')
		.transform(reactify)
		.bundle()
		.pipe(source('castor.js'))
		.pipe(gulp.dest('./djangoServer/castor/static/castor'))
});

// Transcode from EC6 to EC5
gulp.task('transcode', function () {
	return gulp.src(["./src/*.jsx","./src/*.js"])
    .pipe(babel({ 
    	presets: ['es2015']
		}))
    .pipe(gulp.dest("./build"));
});

gulp.task('default', [ 'transcode', 'browserify'] );
