$(function () {
    "use strict";
    changeColors(breakBgColor, breakFgColor);

    $("#pause-timer, #resume-timer, #reset-timer").addClass("hidden");

    $("#clock").html(formatAsMinutes(workTime));

    $("#start-timer").click(function () {
        changeColors(workBgColor, workFgColor);
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
        changeColors(breakBgColor, breakFgColor);
    });
});
