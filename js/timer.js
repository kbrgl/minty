// produces timer objects. all time is in seconds.
function Timer(time, name, callback, stopCallback) {
    "use strict";
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
