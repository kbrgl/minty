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

// tasks
gulp.task('build:js', function (cb) {
	var browserified = through2.obj(function (file, enc, next) {
		browserify(file.path)
			.bundle(function(err, res) {
				// assumes file.contents is a Buffer
				file.contents = res;
				next(null, file);
			});
	});

	gulp.src(sourceDir + '/**/*.js')
		.pipe(plugins.xo())
		.pipe(browserified)
		.pipe(plugins.uglify())
		.pipe(plugins.concat('/scripts/main.js'))
		.pipe(gulp.dest(buildDir));
	cb();
});

gulp.task('build:coffee', function (cb) {
	gulp.src(sourceDir + '/**/*.coffee')
		.pipe(plugins.coffeelint())
		.pipe(plugins.coffee())
		.pipe(gulp.dest(buildDir));
	cb();
});

gulp.task('build:css', function (cb) {
	gulp.src(sourceDir + '/**/*.css')
		.pipe(gulp.dest(buildDir));
	cb();
});

gulp.task('build:scss', function (cb) {
	gulp.src(sourceDir + '/**/*.scss')
		// currently disabled because it is super slow
		//.pipe(plugins.scssLint())
		.pipe(plugins.sass())
		.pipe(gulp.dest(buildDir));
	cb();
});

gulp.task('build:html', function (cb) {
	gulp.src(sourceDir + '/**/*.html')
		.pipe(gulp.dest(buildDir));
	cb();
});

gulp.task('build:extras', function (cb) {
	gulp.src(sourceDir + '/**/*')
		.pipe(gulp.dest(buildDir));
	cb();
});

gulp.task('build:bower', function (cb) {
	gulp.src(mainBowerFiles())
		.pipe(plugins.uglify())
		.pipe(gulp.dest(buildDir + '/lib/'));
	cb();
});

gulp.task('clean', function () {
	return del([buildDir + '/']);
});

gulp.task('build', gulp.series('clean', gulp.parallel('build:js', 'build:coffee', 'build:css', 'build:scss', 'build:html', 'build:extras', 'build:bower')));

gulp.task('webserver', function() {
	gulp.src(buildDir)
		.pipe(plugins.webserver({
			path: '/',
			fallback: 'index.html',
			livereload: true,
			host: '0.0.0.0',
			open: true,
		}));

	gulp.watch(sourceDir + '/**/*')
		.on('change', function () {
			gulp.start('build');
		});
});

function gitAddCommit(message, cb) {
	gulp.src('./**/*')
		.pipe(plugins.excludeGitignore())
		.pipe(plugins.git.add({args: '-A'}))
		.pipe(plugins.git.commit(message));
	if (cb) cb();
}

function gitPush(remote, branch, cb) {
	plugins.git.push('origin', 'master', function (err) {
		if (err) throw err;
		cb();
	});
}

gulp.task('deploy:source', gulp.series(gitAddCommit.bind(null, 'Update ' + new Date().toISOString()), gitPush.bind(null, 'origin', 'master')));

gulp.task('deploy:ghpages', function (cb) {
	gulp.src(buildDir + '/**/*')
		.pipe(plugins.ghPages());
	if (cb) cb();
});

gulp.task('deploy', gulp.parallel('deploy:source', 'deploy:ghpages'));

gulp.task('default', gulp.series('build', function (cb) {
	// webserver doesn't work without the timeout, for some reason.
	setTimeout(function () {
		gulp.start('webserver');
	}, 3000);
	cb();
}));
