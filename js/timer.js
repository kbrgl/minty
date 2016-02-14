// produces timer objects. all time is in seconds.
function Timer(time, name, callback, endCallback, grabTime) {
    if (grabTime === undefined) {
        grabTime = function () {
            return time;
        }
    }
    "use strict";
    // total time
    var tTime = time;

    // remaining time
    var rTime = time;

    // timer name
    this.name = name;
    
    this.isreset = true;

    /* all three vars are used for pause functionality */
    // intervalId isn't local to update() because otherwise I couldn't clearInterval(intervalId) from this.pause() (essentially, the pause method wouldn't work)
    var intervalId;
    // counts the time passed in the current run of update(); reset after update() is run.
    var timeP = 0;
    // counts the total time passed in all runs of update()
    var tTimeP = 0;

    // update timer
    var update = function () {
        this.isreset = false;
        // grab date at start because this function calculates time by subtracting the start date from subsequent dates
        var startDate = new Date();

        // callback before timing starts otherwise initial update of the timer will be delayed by a second
        callback();
        intervalId = setInterval(function () {
            // subtracting date gives time in milliseconds. convert to seconds and add tTimeP. if tTimeP were not added, then whenever the update() function is run after this.pause(), the timer will basically reset.
            timeP = Math.floor((new Date() - startDate) / 1000) + tTimeP;
            
            // if there is less than a second remaining, clean things up and exit.
            if (rTime < 1) {
                callback();
                tTimeP += timeP;
                clearInterval(intervalId);
                endCallback();
            } else {
                // calculate remaining time by subtracting timeP from total time
                rTime = tTime - timeP;
                callback();
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
        this.isreset = true;
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

    // expose user provided functions
    this.grabTime = grabTime;
    this.callback = callback;
    this.endCallback = endCallback;
}
