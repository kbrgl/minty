var Timer = require('./Timer').Timer;

function PomodoroTimer(options) {
	// default options
	options = options || {};
	options.initialState = options.initialState % 3 || 0;
	options.workTime = options.workTime || 25 * 60 * 1000;
	options.breakTime = options.breakTime || 5 * 60 * 1000;
	options.extendedBreakTime = options.extendedBreakTime || 30 * 60 * 1000;
	options.extendedBreakCycles = options.extendedBreakCycles || 4;
	options.render = options.render || function () {};
	options.delay = options.delay || 1;

	// used internally
	var state;
	var cycles;
	var timer;

	// options passed to created timer objects
	var timerOptions =
		{
			render: options.render.bind(this, state),
			callback: function () {
				nextTimer();
				options.render(state);
				start();
			},
			delay: options.delay
		};

	reset();

	// private functions
	function nextTimer() {
		if (state === 0) {
			cycles += 1;
			if (cycles % options.extendedBreakCycles === 0) {
				state = 2;
				timer = new Timer(options.extendedBreakTime, timerOptions);
			} else {
				state = 1;
				timer = new Timer(options.breakTime, timerOptions);
			}
		} else {
			state = 0;
			timer = new Timer(options.workTime, timerOptions);
		}
	}

	function start() {
		timer.start();
		options.render(state);
	}

	function pause() {
		timer.pause();
	}

	function reset() {
		state = options.initialState;
		if (state === 0) {
			timer = new Timer(options.workTime, timerOptions);
		} else if (state === 1) {
			timer = new Timer(options.breakTime, timerOptions);
		} else if (state === 2) {
			timer = new Timer(options.extendedBreakTime, timerOptions);
		}
		cycles = 0;
	}

	function refresh(newOptions) {
		options = newOptions || {};
		options.initialState = newOptions.initialState || 0;
		options.workTime = newOptions.workTime || 25 * 60 * 1000;
		options.breakTime = newOptions.breakTime || 5 * 60 * 1000;
		options.extendedBreakTime = newOptions.extendedBreakTime || 30 * 60 * 1000;
		options.extendedBreakCycles = newOptions.extendedBreakCycles || 4;
		options.render = newOptions.render || function () {};
		options.delay = newOptions.delay || 1;
		if (state === 0) {
			timer.time = options.workTime;
		} else if (state === 1) {
			timer.time = options.breakTime;
		} else if (state === 2) {
			timer.time = options.extendedBreakTime;
		}
	}

	// public API
	this.refresh = refresh;
	this.start = start;
	this.reset = reset;
	this.pause = pause;
}

exports.PomodoroTimer = PomodoroTimer;
