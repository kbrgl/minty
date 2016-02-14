$(function () {
    "use strict";
    changeColors(defaultBgColor, defaultFgColor);
    $("#options").hide();

    $("#pause-timer, #resume-timer, #reset-timer").hide();

    $("#clock").html(formatAsMinutes(workTime));

    $("#start-timer").click(function () {
        changeColors(workBgColor, workFgColor);
        timer.start();
        $("#start-timer").hide();
        $("#pause-timer, #clock").show();
        $("#type").fadeIn(500, 'linear');
    });

    $("#pause-timer").click(function () {
        timer.pause();
        $("#pause-timer, #resume-timer, #reset-timer").toggle();
    });

    $("#resume-timer").click(function () {
        timer.resume();
        $("#pause-timer, #resume-timer, #reset-timer").toggle();
    });

    $("#reset-timer").click(function () {
        timer.reset();
        cycles = 0;
        $("#type").html("");
        $("#clock").html(formatAsMinutes(workTime));        
        $("#start-timer, #reset-timer, #resume-timer, #type").toggle();
        changeColors(defaultBgColor, defaultFgColor);
    });

    $("#cog").click(function () {
        $("#options").slideToggle();
    });
});
