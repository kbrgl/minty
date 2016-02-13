// definitions of timings. these are the standard timings used in pomodoro timers.
var workTime = 25 * 60;
var breakTime = 5 * 60;
var longerBreakTime = 20 * 60;

// colors used in background and foreground
var workBgColor = "#555555";
var workFgColor = "#ffffff";
var breakBgColor = "#2fe7ad";
var breakFgColor = "#ffffff";

// used to keep track of number of cycles completed so that extra break time can be given every 4 cycles
var cycles = 0;