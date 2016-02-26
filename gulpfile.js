'use strict';
// gulp + plugins
var gulp = require('gulp');
var plugins = (require('gulp-load-plugins'))();
var mainBowerFiles = require('main-bower-files');
var browserify = require('browserify');
var through2 = require('through2');
var del = require('del');
var inquirer = require('inquirer');

// directories
var sourceDir = './src';
var buildDir = './build';

// build stuff
gulp.task('build:js', function () {
	var browserified = through2.obj(function (file, enc, next) {
		browserify(file.path)
			.bundle(function(err, res) {
				// assumes file.contents is a Buffer
				file.contents = res;
				next(null, file);
			});
	});

	return gulp.src(sourceDir + '/**/*.js')
		//.pipe(plugins.xo())
		.pipe(browserified)
		.pipe(plugins.uglify())
		.pipe(plugins.concat('/scripts/main.js'))
		.pipe(gulp.dest(buildDir));
});

gulp.task('build:coffee', function () {
	return gulp.src(sourceDir + '/**/*.coffee')
		.pipe(plugins.coffeelint())
		.pipe(plugins.coffee())
		.pipe(gulp.dest(buildDir));
});

gulp.task('build:css', function () {
	return gulp.src(sourceDir + '/**/*.css')
		.pipe(gulp.dest(buildDir));
});

gulp.task('build:scss', function () {
	return gulp.src(sourceDir + '/**/*.scss')
		.pipe(plugins.scssLint())
		.pipe(plugins.sass())
		.pipe(gulp.dest(buildDir));
});

gulp.task('build:html', function () {
	return gulp.src(sourceDir + '/**/*.html')
		.pipe(gulp.dest(buildDir));
});

gulp.task('build:extras', function () {
	return gulp.src(sourceDir + '/**/*')
		.pipe(gulp.dest(buildDir));
});

gulp.task('build:bower', function () {
	return gulp.src(mainBowerFiles())
		.pipe(plugins.uglify())
		.pipe(gulp.dest(buildDir + '/lib/'));
});

// deletes the build directory
gulp.task('clean', function () {
	return del([buildDir]);
});

// compose build subtasks into one big build task
gulp.task('build', gulp.series('clean', gulp.parallel('build:js', 'build:coffee', 'build:css', 'build:scss', 'build:html', 'build:extras', 'build:bower')));


// starts a webserver using the gulp-webserver plugin
gulp.task('webserver', function() {
	gulp.src(buildDir)
		.pipe(plugins.webserver({
			path: '/',
			fallback: 'index.html',
			livereload: true,
			host: '0.0.0.0',
			open: true,
		}));

	// currently rebuilds everything when a single file is changed
	gulp.watch(sourceDir + '/**/*')
		.on('change', function () {
			gulp.series('build');
		});
});

// deploy to GitHub pages
gulp.task('deploy', gulp.series('build', function () {
	return gulp.src(buildDir + '/**/*')
		.pipe(plugins.ghPages());
}));

gulp.task('default', gulp.series('build', 'webserver'));
