$(function () {
    "use strict";
    // produces timer objects. all time is in seconds.
    function Timer(time, name, callback, stopCallback) {
        // total time
        var tTime = time;

        // current time
        var rTime = time;
        this.name = name;
        var intervalId;

        // decrement time
        var resume = function () {
            // works by decrementing time each second unless interrupted or no time remaining
            callback();
            intervalId = setInterval(function () {
                if ((rTime--) < 1) {
                    callback();
                    clearInterval(intervalId);
                    stopCallback();
                } else {
                    callback();
                }
            }, 1000);
        };

        this.start = function () {
            resume();
        };

        this.pause = function () {
            clearInterval(intervalId);
        };

        this.resume = function () {
            resume();
        };

        this.reset = function () {
            rTime = tTime;
        };

        // get total time
        this.getTotal = function () {
            return tTime;
        };

        // change total time
        this.setTotal = function (n) {
            tTime = n;
        };

        // get the remaining timer time in seconds
        this.getTimeRemaining = function () {
            return rTime;
        };

        this.setTimeRemaining = function (n) {
            rTime = n;
        };
    }

    var formatAsMinutes, timer;

    // used to keep track of number of cycles completed so that extra break time can be given every 4 cycles
    var cycles = 0;

    // definitions of timings. these are the standard timings used in pomodoro timers.
    var workTime = 25 * 60;
    var breakTime = 5 * 60;
    var longerBreakTime = 20 * 60;

    formatAsMinutes = function (seconds) {
        return Math.floor(seconds / 60) + ":" + (seconds % 60 < 10 ? "0" : "") + seconds % 60;
    };

    $("#pause-timer, #resume-timer, #reset-timer").addClass("hidden");

    $("#clock").html(formatAsMinutes(workTime));

    $("#start-timer").click(function () {
        timer = new Timer(workTime, "work", function (seconds, name) {
            if (seconds !== undefined && name !== undefined) {
                $("#clock").html(formatAsMinutes(seconds));
                $("#type").html(name);
            } else {
                $("#clock").html(formatAsMinutes(timer.getTimeRemaining()));
                $("#type").html(timer.name);
            }
        }, function () {
            timer.pause();
            if (timer.name === "work") {
                cycles++;
                timer.name = "break";
                if (cycles % 4 === 0) {
                    timer.setTotal(longerBreakTime);
                } else {
                    timer.setTotal(breakTime);
                }
                timer.reset();
            } else {
                timer.name = "work";
                timer.setTotal(workTime);
                timer.reset();
            }
            timer.resume();
        });
        timer.start();
        $("#start-timer").addClass("hidden");
        $("#pause-timer, #clock, #type").removeClass("hidden");
    });

    $("#pause-timer").click(function () {
        timer.pause();
        $("#pause-timer").addClass("hidden");
        $("#resume-timer, #reset-timer").removeClass("hidden");
    });

    $("#resume-timer").click(function () {
        timer.resume();
        $("#resume-timer, #reset-timer").addClass("hidden");
        $("#pause-timer").removeClass("hidden");
    });

    $("#reset-timer").click(function () {
        timer.reset();
        cycles = 0;
        $("#type").html("");
        $("#clock").html(formatAsMinutes(workTime));        
        $("#reset-timer, #resume-timer, #type").addClass("hidden");
        $("#start-timer").removeClass("hidden");
    });
});
