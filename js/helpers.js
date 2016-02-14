var formatAsMinutes = function (seconds) {
    if (!(seconds < 0)) {
        return Math.floor(seconds / 60) + ":" + (seconds % 60 < 10 ? "0" : "") + seconds % 60;
    } else {
        return "-(" + Math.floor(-seconds / 60) + ":" + (-seconds % 60 < 10 ? "0" : "") + -seconds % 60 + ")";
    }
};

var changeColors = function (background, foreground) {
    $("body").css("background", background);
    $("body").css("color", foreground);
    $(".status").css("border-left-color", foreground);
    $("button").css("border-color", foreground);
    $("#theme-color").attr("content", background);
};

// setup a timer object
var timer = new Timer(workTime, "work", { mainCallback: function (seconds, name) {
        if (seconds !== undefined && name !== undefined) {
            $("#clock").html(formatAsMinutes(seconds));
            $("#type").html(name);
        } else {
            $("#clock").html(formatAsMinutes(timer.getTimeRemaining()));
            $("#type").html(timer.name);
        }
    }, endCallback: function () {
        timer.pause();
        if (timer.name === "work") {
            changeColors(breakBgColor, breakFgColor);
            cycles++;
            timer.name = "break";
            if (cycles % longerBreakRequiredCycles === 0) {
                timer.setTotal(longerBreakTime);
            } else {
                timer.setTotal(breakTime);
            }
            timer.reset();
        } else {
            changeColors(workBgColor, workFgColor);
            timer.name = "work";
            timer.setTotal(workTime);
            timer.reset();
        }
        timer.resume();
    } }, { grabTime: function () {
        if (timer.name === "work") {
            timer.setTotal(workTime);
        } else if (cycles % longerBreakRequiredCycles === 0) {
            timer.setTotal(longerBreakTime);
        } else {
            timer.setTotal(breakTime);
    } }
});