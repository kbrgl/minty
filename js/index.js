// if not currently stored, then set timings in local storage.
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
if (!localStorage.getItem('sound')) {
    localStorage.setItem('sound', true);
}
if (!localStorage.getItem('alerts')) {
    localStorage.setItem('alerts', false);
}

// colors used in background and foreground
var colors = {
    workBgColor: "#303030",
    workFgColor: "#ffffff",
    breakBgColor: "#2fe7ad",
    breakFgColor: "#ffffff",
    defaultBgColor: '#00e676',
    defaultFgColor: "#ffffff",
};

var soundEnabled = localStorage.getItem('sound');
var alertsEnabled = localStorage.getItem('alerts');
var ntAudio = new Audio("audio/nt.mp3");

var formatAsMinutes = function (seconds) {
    if (seconds >= 0) {
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

var notify = function (text) {
  // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      return;
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
        var notification = new Notification(text);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
          // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(text);
            }
        });
    }

    if (soundEnabled === true) {
        ntAudio.play();
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
};

var external = {
    callbacks: {
        main: function (seconds, state) {
            if (state < 0) {
                $("#clock").html(formatAsMinutes(seconds));
            } else {
                $("#clock").html(formatAsMinutes(seconds));
                $("#type").html(state === 0 ? 'work' : 'break');
            }
        },
        end: function (to) {
            if (to > 0) {
                notify('Your break has ended!');
                changeColors(colors.breakBgColor, colors.breakFgColor);
            } else {
                notify('It\'s time to take a break.');
                changeColors(colors.workBgColor, colors.workFgColor);
            }
        },
        time: function (state) {
            if (state === 0) {
                return this.config.workTime;
            }
            else if (state === 1) {
                return this.config.breakTime;
            }
            else if (state === 2) {
                return this.config.extendedBreakTime;
            }
        },
    },
    config: {
        workTime: localStorage.getItem('workTime'),
        breakTime: localStorage.getItem('breakTime'),
        extendedBreakTime: localStorage.getItem('longerBreakTime'),
        extendedBreakRequiredCycles: localStorage.getItem('longerBreakRequiredCycles'),
    },
};

var pomodoroTimer = {
    external: external,
    tTime: this.external.config.workTime,
    rTime: this.tTime,
    state: -1,
    cycles: 0,
    timeP: 0,
    tTimeP: 0,
    intervalId: null,
};

pomodoroTimer.decrement = function (startDate) {
    this.timeP = Math.floor((new Date() - startDate) / 1000) + this.tTimeP;
    if (this.rTime < 1) {
        this.pause();
        this.tTimeP += this.timeP;

        if (this.state === 0) {
            this.cycles++;
        }

        if (this.cycles % this.external.config.extendedBreakRequiredCycles === 0) {
            if (this.cycles === this.state) {
                this.state = 0;
            } else {
                this.state = 2;
            }
        } else {
            this.state = (this.state + 1) % 2;
        }

        if (this.state === 0) {
            this.tTime = this.external.config.workTime;
        } else {
            if (this.state === 1) {
                this.tTime = this.external.config.breakTime;
            } else if (this.state === 2) {
                this.tTime = this.external.config.extendedBreakTime;
            }
        }

        this.external.callbacks.main(this.rTime, this.state);
        this.external.callbacks.end(this.state);
        this.internalReset();
        this.resume();
    } else {
        this.rTime = this.tTime - this.timeP;
        this.external.callbacks.main(this.rTime, this.state);
    }
};

pomodoroTimer.start = function () {
    this.state = 0;
    this.resume();
};

pomodoroTimer.resume = function () {
    var startDate = new Date();

    this.timeP = Math.floor((new Date() - startDate) / 1000) + this.tTimeP;
    this.rTime = this.tTime - this.timeP;
    this.external.callbacks.main(this.rTime, this.state);

    this.intervalId = setInterval(this.decrement.bind(this, startDate), 1000);
};

pomodoroTimer.pause = function () {
    clearInterval(this.intervalId);
    this.tTimeP = this.timeP;
};

pomodoroTimer.internalReset = function () {
    this.tTimeP = 0;
    this.rTime = this.tTime;
};

pomodoroTimer.reset = function () {
    this.tTime = this.external.config.workTime;
    this.tTimeP = 0;
    this.cycles = 0;
    this.rTime = this.tTime;
    this.state = -1;
};

pomodoroTimer.refresh = function () {
    if (this.state < 1) {
        this.tTime = this.external.config.workTime;
    } else if (this.state === 1) {
        this.tTime = this.external.config.breakTime;
    } else if (this.state === 2) {
        this.tTime = this.external.config.extendedBreakTime;
    }
};

$(function () {
    "use strict";

    // initialize the app. rest of the behaviours are bound to events.
    changeColors(colors.defaultBgColor, colors.defaultFgColor);
    $("#options").hide();
    $("#pause-timer, #resume-timer, #reset-timer").hide();
    $("#clock").html(formatAsMinutes(pomodoroTimer.tTime));
    $("input[name='workTime']").attr('value', pomodoroTimer.external.config.workTime / 60);
    $("input[name='breakTime']").attr('value', pomodoroTimer.external.config.breakTime / 60);
    $("input[name='longerBreakTime']").attr('value', pomodoroTimer.external.config.extendedBreakTime / 60);
    $("input[name='longerBreakRequiredCycles']").attr('value', pomodoroTimer.external.config.extendedBreakRequiredCycles);
    if (soundEnabled) {
        $("input[name='sound']").removeAttr('checked');
    }
    if (alertsEnabled) {
        $("input[name='alerts']").attr('checked');
    }

    $("#start-timer").click(function () {
        changeColors(colors.workBgColor, colors.workFgColor);
        pomodoroTimer.start();
        $("#start-timer").hide();
        $("#pause-timer, #clock").show();
        $("#type").fadeIn(500, 'linear');
    });

    $("#pause-timer").click(function () {
        pomodoroTimer.pause();
        $("#pause-timer, #resume-timer, #reset-timer").toggle();
    });

    $("#resume-timer").click(function () {
        pomodoroTimer.resume();
        $("#pause-timer, #resume-timer, #reset-timer").toggle();
    });

    $("#reset-timer").click(function () {
        pomodoroTimer.reset();
        $("#type").html("");
        $("#clock").html(formatAsMinutes(pomodoroTimer.tTime));
        $("#start-timer, #reset-timer, #resume-timer, #type").toggle();
        changeColors(colors.defaultBgColor, colors.defaultFgColor);
    });

    $("#cog").click(function () {
        $("#options").slideToggle();
    });

    $("#submit").click(function () {
        localStorage.setItem('workTime', $("input[name='workTime']").val() * 60);
        localStorage.setItem('breakTime', $("input[name='breakTime']").val() * 60);
        localStorage.setItem('longerBreakTime', $("input[name='longerBreakTime']").val() * 60);
        localStorage.setItem('longerBreakRequiredCycles', $("input[name='longerBreakRequiredCycles']").val());
        localStorage.setItem('sound', !($("input[name='sound']").is(':checked')));
        localStorage.setItem('alerts', $("input[name='alerts']").is(':checked'));

        pomodoroTimer.external.config.workTime = $("input[name='workTime']").val() * 60;
        pomodoroTimer.external.config.breakTime = $("input[name='breakTime']").val() * 60;
        pomodoroTimer.external.config.longerBreakTime = $("input[name='longerBreakTime']").val() * 60;
        pomodoroTimer.external.config.longerBreakRequiredCycles = $("input[name='longerBreakRequiredCycles']").val();

        soundEnabled = !($("input[name='sound']").is(':checked'));
        alertsEnabled = $("input[name='alerts']").is(':checked');

        // flash screen to indicate that changes have been saved.
        var initial = $("body").css("background-color");
        $("#options").hide(200);
        $("body").css("background-color", "#7c4dff");
        setTimeout(function () {
            $("body").css("background-color", initial);
        }, 500);

        pomodoroTimer.refresh();
        pomodoroTimer.external.callbacks.main(pomodoroTimer.tTime, pomodoroTimer.state);
    });

    $(window).on("beforeunload", function () {
        if (alertsEnabled === true) {
            return "Closing the tab will cause your pomodoros to be reset.";
        } else {
            return;
        }
    });
});
