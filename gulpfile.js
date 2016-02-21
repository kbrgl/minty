// gulp + plugins
var gulp = require('gulp');
var plugins = (require('gulp-load-plugins'))();
var mainBowerFiles = require('main-bower-files');
var browserify = require('browserify');
var through2 = require('through2');
var exec = require('child_process').exec;

// directories
var sourceDir = './src';
var buildDir = './build';

// tasks
gulp.task('build:js', function () {
	var browserified = through2.obj(function (file, enc, next) {
		browserify(file.path)
			.bundle(function(err, res) {
				// assumes file.contents is a Buffer
				file.contents = res;
				next(null, file);
			});
	})

	gulp.src(sourceDir + '/**/*.js')
		.pipe(plugins.xo())
		.pipe(browserified)
		.pipe(plugins.uglify())
		.pipe(plugins.concat('/scripts/main.js'))
		.pipe(gulp.dest(buildDir));
});

gulp.task('build:coffee', function () {
	gulp.src(sourceDir + '/**/*.coffee')
		.pipe(plugins.coffeelint())
		.pipe(plugins.coffee())
		.pipe(gulp.dest(buildDir));
});

gulp.task('build:css', function () {
	gulp.src(sourceDir + '/**/*.css')
		.pipe(gulp.dest(buildDir));
});

gulp.task('build:scss', function () {
	gulp.src(sourceDir + '/**/*.scss')
		.pipe(plugins.scssLint())
		.pipe(plugins.sass())
		.pipe(gulp.dest(buildDir));
});

gulp.task('build:html', function () {
	gulp.src(sourceDir + '/**/*.html')
		.pipe(gulp.dest(buildDir));
});

gulp.task('build:extras', function () {
	gulp.src(sourceDir + '/**/!*.{js,coffee,html,css,scss}')
		.pipe(gulp.dest(buildDir));
});

gulp.task('build:bower', function () {
	gulp.src(mainBowerFiles())
		.pipe(plugins.uglify())
		.pipe(gulp.dest(buildDir + '/lib/'));
});

gulp.task('clean', function () {
	exec('rm -rf build');
});

gulp.task('build', ['build:js', 'build:coffee', 'build:css', 'build:scss', 'build:html', 'build:extras', 'build:bower']);

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

gulp.task('deploy', ['clean', 'build'], function () {
	return gulp.src('./**/*')
		.pipe(plugins.gitignore())
		.pipe(plugins.ghPages());
});

gulp.task('default', ['clean', 'build'], function () {
	// webserver doesn't work without the timeout, for some reason.
	setTimeout(function () {
		gulp.start('webserver');
	}, 3000);
});
