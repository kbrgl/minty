if (!localStorage.getItem('workTime')) {
	localStorage.setItem('workTime', 25 * 60);
}
if (!localStorage.getItem('breakTime')) {
	localStorage.setItem('breakTime', 5 * 60);
}
if (!localStorage.getItem('longerBreakTime')) {
	localStorage.setItem('longerBreakTime', 20 * 60);
}
if (!localStorage.getItem('longerBreakRequiredCycles')) {
	localStorage.setItem('longerBreakRequiredCycles', 4);
}
// definitions of timings. these are the standard timings used in pomodoro timers.
var workTime = localStorage.getItem('workTime');
var breakTime = localStorage.getItem('breakTime');
var longerBreakTime = localStorage.getItem('longerBreakTime');

// number of cycles before a longer break is given
var longerBreakRequiredCycles = localStorage.getItem('longerBreakRequiredCycles');

// colors used in background and foreground
var workBgColor = "#555555";
var workFgColor = "#ffffff";
var breakBgColor = "#2fe7ad";
var breakFgColor = "#ffffff";

// used to keep track of number of cycles completed so that extra break time can be given every 4 cycles
var cycles = 0;