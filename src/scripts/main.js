var PomodoroTimer = require('./PomodoroTimer').PomodoroTimer;

(function ($) {
	'use strict';
	$(function () {
		var defaults = {
			workTime: 25 * 1000 * 60,
			breakTime: 5 * 1000 * 60,
			extendedBreakTime: 30 * 1000 * 60,
			extendedBreakCycles: 4
		};

		if (!localStorage.getItem('workTime')) {
			localStorage.setItem('workTime', defaults.workTime);
		}
		if (!localStorage.getItem('breakTime')) {
			localStorage.setItem('breakTime', defaults.breakTime);
		}
		if (!localStorage.getItem('longerBreakTime')) {
			localStorage.setItem('longerBreakTime', defaults.extendedbreakTime);
		}
		if (!localStorage.getItem('longerBreakRequiredCycles')) {
			localStorage.setItem('longerBreakRequiredCycles', defaults.extendedBreakCycles);
		}

		var changeColors = function (background) {
			$('body').css('background', background);
			$('meta[name="theme-color"]').attr('content', background);
		};

		var colors = {
			workBgColor: '#303030',
			breakBgColor: '#2fe7ad',
			defaultBgColor: '#00e676',
			flashColor: '#7c4dff'
		};

		var options = {
			render: function (time) {
				if (time || time === 0) {
					time = Math.ceil(time / 1000);
					time = Math.trunc(time / 60) + ':' + (time % 60 < 10 ? '0' : '') + time % 60;
					$('#clock').html(time);
				}
			},
			stateChange: function (state) {
				if (state === 0) {
					$('#type').html('work');
					changeColors(colors.workBgColor);
				} else if (state === 1) {
					$('#type').html('break');
					changeColors(colors.breakBgColor);
				} else if (state === 2) {
					$('#type').html('extended break');
					changeColors(colors.breakBgColor);
				}
			},
			workTime: localStorage.getItem('workTime'),
			breakTime: localStorage.getItem('breakTime'),
			extendedBreakTime: localStorage.getItem('longerBreakTime'),
			extendedBreakCycles: localStorage.getItem('longerBreakRequiredCycles'),
			delay: 1000
		};

		var t = new PomodoroTimer(options);

		// initialize the app. rest of the behaviours are bound to events.
		changeColors(colors.defaultBgColor);
		$('#options').hide();
		$('#pause-timer, #resume-timer, #reset-timer').hide();

		// form persistence
		$('input[name="workTime"]').val(options.workTime / 1000 / 60);
		$('input[name="breakTime"]').val(options.breakTime / 1000 / 60);
		$('input[name="longerBreakTime"]').val(options.extendedBreakTime / 1000 / 60);
		$('input[name="longerBreakRequiredCycles"]').val(options.extendedBreakCycles);

		window.startTimer = function () {
			changeColors(colors.workBgColor);
			t.start();
			$('#start-timer').hide();
			$('#pause-timer, #clock').show();
			$('#type').fadeIn(500, 'linear');
		};

		window.pauseTimer = function () {
			t.pause();
			$('#pause-timer, #resume-timer, #reset-timer').toggle();
		};

		window.resumeTimer = function () {
			t.start();
			$('#pause-timer, #resume-timer, #reset-timer').toggle();
		};

		window.resetTimer = function () {
			t.reset();
			$('#type').html('');
			$('#start-timer, #reset-timer, #resume-timer, #type').toggle();
			changeColors(colors.defaultBgColor);
		};

		window.toggleOptions = function () {
			$('#options').slideToggle();
		};

		window.saveOptions = function () {
			options.workTime = $('input[name="workTime"]').val() * 1000 * 60;
			options.breakTime = $('input[name="breakTime"]').val() * 1000 * 60;
			options.extendedBreakTime = $('input[name="longerBreakTime"]').val() * 1000 * 60;
			options.extendedBreakCycles = $('input[name="longerBreakRequiredCycles"]').val();

			t.refresh(options);

			localStorage.setItem('workTime', options.workTime);
			localStorage.setItem('breakTime', options.breakTime);
			localStorage.setItem('longerBreakTime', options.extendedBreakTime);
			localStorage.setItem('longerBreakRequiredCycles', options.extendedBreakCycles);

			// flash screen to indicate that changes have been saved.
			var initial = $('body').css('background-color');
			$('#options').hide(200);
			$('body').css('background-color', colors.flashColor);
			setTimeout(function () {
				$('body').css('background-color', initial);
			}, 500);
		};

		window.defaultifyOptions = function () {
			$('input[name="workTime"]').val(defaults.workTime / 1000 / 60);
			$('input[name="breakTime"]').val(defaults.breakTime / 1000 / 60);
			$('input[name="longerBreakTime"]').val(defaults.extendedBreakTime / 1000 / 60);
			$('input[name="longerBreakRequiredCycles"]').val(defaults.extendedBreakCycles);
		};
	});
})(jQuery);
