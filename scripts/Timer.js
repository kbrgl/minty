function Timer(totalTime, options) {
	if (!totalTime || totalTime instanceof Object) {
		return;
	}

	// default options
	options = options || {};
	options.delay = options.delay || 1;
	options.callback = options.callback || function () {};
	options.render = options.render || function () {};

	var offset = 0;
	var id = null;
	var	time;

	reset();

	// private functions
	function start() {
		if (!id) {
			offset = Date.now();
			id = setInterval(update, options.delay);
		}
	}

	function update() {
		time -= delta();
		if (time < 0) {
			reset();
			options.callback();
		} else {
			render();
		}
	}

	function delta() {
		var now = Date.now();
		var d = now - offset;

		offset = now;
		return d;
	}

	function pause() {
		if (id) {
			clearInterval(id);
			id = null;
		}
	}

	function reset() {
		pause();
		time = totalTime;
		render();
	}

	function render() {
		options.render(time);
	}

	// getters and setters
	this.__defineSetter__('time', function (newTime) {
		if (totalTime >= 0) {
			totalTime = newTime;
			time = totalTime;
			render();
		}
	});
	this.__defineGetter__('time', function () {
		return time;
	});

	this.__defineGetter__('totalTime', function () {
		return totalTime;
	});

	this.__defineSetter__('options', function (newOptions) {
		// default options
		options = newOptions || {};
		options.delay = newOptions.delay || 1;
		options.callback = newOptions.callback || function () {};
		options.render = newOptions.render || function () {};
	});
	this.__defineGetter__('options', function () {
		return options;
	});

	// public API
	this.start = start;
	this.pause = pause;
	this.reset = reset;
}

exports.Timer = Timer;
