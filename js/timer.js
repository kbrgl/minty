// produces timer objects. all time is in seconds.
function Timer(time, name, callbacks, userdefun) {
    "use strict";
    // total time
    var tTime = time;

    // remaining time
    var rTime = time;

    // timer name
    this.name = name;

    // user defined functions
    this.userdefun = userdefun;

    /* all three vars are used for pause functionality */
    // intervalId isn't local to update() because otherwise I couldn't clearInterval(intervalId) from this.pause() (essentially, the pause method wouldn't work)
    var intervalId;
    // counts the time passed in the current run of update(); reset after update() is run.
    var timeP = 0;
    // counts the total time passed in all runs of update()
    var tTimeP = 0;

    // update timer
    var update = function () {
        // grab date at start because this function calculates time by subtracting the start date from subsequent dates
        var startDate = new Date();

        // run main callback at start otherwise there will be a one second delay
        timeP = Math.floor((new Date() - startDate) / 1000) + tTimeP;
        rTime = tTime - timeP;
        callbacks.mainCallback();

        intervalId = setInterval(function () {
            // subtracting date gives time in milliseconds. convert to seconds and add tTimeP. if tTimeP were not added, then whenever the update() function is run after this.pause(), the timer will basically reset.
            timeP = Math.floor((new Date() - startDate) / 1000) + tTimeP;

            // if there is less than a second remaining, clean things up and exit.
            if (rTime < 1) {
                clearInterval(intervalId);
                tTimeP += timeP;
                callbacks.mainCallback();
                callbacks.endCallback();
            } else {
                // calculate remaining time by subtracting timeP from total time
                rTime = tTime - timeP;
                callbacks.mainCallback();
            }
        }, 1000);
    };

    // start timer
    this.start = function () {
        update();
    };

    this.pause = function () {
        tTimeP = timeP;
        clearInterval(intervalId);
    };

    // same as this.start(), but this provides an extra verb for clarity
    this.resume = function () {
        update();
    };

    // reset timer
    this.reset = function () {
        // reset total time passed
        tTimeP = 0;
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

    // set the remaining timer time in seconds
    this.setTimeRemaining = function (n) {
        rTime = n;
    };
}
