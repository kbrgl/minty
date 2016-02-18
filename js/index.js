(function ($) {
    "use strict";
    function Timer(totalTime, options) {
        if (!totalTime) {
            return;
        }

        // default options
        options = options || {};
        options.delay = options.delay || 1;
        options.callback = options.callback || function () {};
        options.render = options.render || function () {};

        var offset = 0,
            id = null,
            time;

        reset();

        // private functions
        function start() {
            if (!id) {
                offset = Date.now();
                id = setInterval(update, options.delay);
            }
        }

        function update() {
            time -= delta();
            if (time < 0) {
                reset();
                options.callback();
            } else {
                render();
            }
        }

        function delta() {
            var now = Date.now();
            var d = now - offset;

            offset = now;
            return d;
        }

        function pause() {
            if (id) {
                clearInterval(id);
                id = null;
            }
        }

        function reset() {
            pause();
            time = totalTime;
            render();
        }

        function render() {
            options.render(time);
        }

        // public API
        this.setTime = function (newTotal) {
            if (totalTime >= 0) {
                totalTime = newTotal;
                time = totalTime;
                render();
            } else {
                console.log("error: strange argument: " + newTotal);
            }
        };
        this.start = start;
        this.pause = pause;
        this.reset = reset;
    }

    function PomodoroTimer (options) {
        // default options
        options = options || {};
        options.initialState = options.initialState % 3 || 0;
        options.workTime = options.workTime || 25 * 60 * 1000;
        options.breakTime = options.breakTime || 5 * 60 * 1000;
        options.extendedBreakTime = options.extendedBreakTime || 30 * 60 * 1000;
        options.extendedBreakCycles = options.extendedBreakCycles || 4;
        options.render = options.render || function () {};
        options.stateChange = options.stateChange || function () {};
        options.delay = options.delay || 1;

        // used internally
        var state, cycles, timer;

        // options passed to created timer objects
        var timerOptions =
        {
                render: options.render,
                callback: function () {
                    nextTimer();
                    options.stateChange(state);
                    start();
                },
                delay: options.delay,
        };

        reset();

        // private functions
        function nextTimer () {
            if (state === 0) {
                cycles += 1;
                if (cycles % options.extendedBreakCycles === 0) {
                    state = 2;
                    timer = new Timer(options.extendedBreakTime, timerOptions);
                } else {
                    state = 1;
                    timer = new Timer(options.breakTime, timerOptions);
                }
            } else {
                state = 0;
                timer = new Timer(options.workTime, timerOptions);
            }
        }

        function start () {
            timer.start();
            options.stateChange(state);
        }

        function pause () {
            timer.pause();
        }

        function reset () {
            state = options.initialState;
            if (state === 0) {
                timer = new Timer(options.workTime, timerOptions);
            } else if (state === 1) {
                timer = new Timer(options.breakTime, timerOptions);
            } else if (state === 2) {
                timer = new Timer(options.extendedBreakTime, timerOptions);
            }
            cycles = 0;
        }

        function refresh (newOptions) {
            options = newOptions || {};
            options.initialState = newOptions.initialState || 0;
            options.workTime = newOptions.workTime || 25 * 60 * 1000;
            options.breakTime = newOptions.breakTime || 5 * 60 * 1000;
            options.extendedBreakTime = newOptions.extendedBreakTime || 30 * 60 * 1000;
            options.extendedBreakCycles = newOptions.extendedBreakCycles || 4;
            options.render = newOptions.render || function () {};
            options.stateChange = newOptions.stateChange || function () {};
            options.delay = newOptions.delay || 1;
            if (state === 0) {
                timer.setTime(options.workTime);
            } else if (state === 1) {
                timer.setTime(options.breakTime);
            } else if (state === 2) {
                timer.setTime(options.extendedBreakTime);
            }
        }

        // public API
        this.refresh = refresh;
        this.start = start;
        this.reset = reset;
        this.pause = pause;
    }

    $(function () {
        var defaults = {
            workTime: 25 * 1000 * 60,
            breakTime: 5 * 1000 * 60,
            extendedBreakTime: 30 * 1000 * 60,
            extendedBreakCycles: 4,
        };

        if (!localStorage.getItem('workTime')) {
            localStorage.setItem('workTime', defaults.workTime);
        }
        if (!localStorage.getItem('breakTime')) {
            localStorage.setItem('breakTime', defaults.breakTime);
        }
        if (!localStorage.getItem('longerBreakTime')) {
            localStorage.setItem('longerBreakTime', defaults.extendedbreakTime);
        }
        if (!localStorage.getItem('longerBreakRequiredCycles')) {
            localStorage.setItem('longerBreakRequiredCycles', defaults.extendedBreakCycles);
        }

        var changeColors = function (background) {
            $("body").css("background", background);
            $("#theme-color").attr("content", background);
        };

        var colors = {
            workBgColor: "#303030",
            breakBgColor: "#2fe7ad",
            defaultBgColor: "#00e676",
            flashColor: "#7c4dff"
        };

        var options = {
            render: function (time) {
                if (time || time === 0) {
                    time = Math.ceil(time / 1000);
                    time = Math.trunc(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
                    $("#clock").html(time);
                } else {
                    console.log("error: strange argument: " + time);
                }
            },
            stateChange: function (state) {
                if (state === 0) {
                    $("#type").html("work");
                    changeColors(colors.workBgColor);
                } else if (state === 1) {
                    $("#type").html("break");
                    changeColors(colors.breakBgColor);
                } else if (state === 2) {
                    $("#type").html("extended break");
                    changeColors(colors.breakBgColor);
                } else {
                    console.log("error: strange argument: " + state);
                }
            },
            workTime: localStorage.getItem('workTime'),
            breakTime: localStorage.getItem('breakTime'),
            extendedBreakTime: localStorage.getItem('longerBreakTime'),
            extendedBreakCycles: localStorage.getItem('longerBreakRequiredCycles'),
            delay: 1000,
        };

        var t = new PomodoroTimer(options);

        // initialize the app. rest of the behaviours are bound to events.
        changeColors(colors.defaultBgColor);
        $("#options").hide();
        $("#pause-timer, #resume-timer, #reset-timer").hide();

        // form persistence
        $("input[name='workTime']").val(options.workTime / 1000 / 60);
        $("input[name='breakTime']").val(options.breakTime / 1000 / 60);
        $("input[name='longerBreakTime']").val(options.extendedBreakTime / 1000 / 60);
        $("input[name='longerBreakRequiredCycles']").val(options.extendedBreakCycles);

        $("#start-timer").click(function () {
            changeColors(colors.workBgColor);
            t.start();
            $("#start-timer").hide();
            $("#pause-timer, #clock").show();
            $("#type").fadeIn(500, 'linear');
        });

        $("#pause-timer").click(function () {
            t.pause();
            $("#pause-timer, #resume-timer, #reset-timer").toggle();
        });

        $("#resume-timer").click(function () {
            t.start();
            $("#pause-timer, #resume-timer, #reset-timer").toggle();
        });

        $("#reset-timer").click(function () {
            t.reset();
            $("#type").html("");
            $("#start-timer, #reset-timer, #resume-timer, #type").toggle();
            changeColors(colors.defaultBgColor);
        });

        $("#cog").click(function () {
            $("#options").slideToggle();
        });

        $("#submit").click(function () {
            options.workTime = $("input[name='workTime']").val() * 1000 * 60;
            options.breakTime = $("input[name='breakTime']").val() * 1000 * 60;
            options.extendedBreakTime = $("input[name='longerBreakTime']").val() * 1000 * 60;
            options.extendedBreakCycles = $("input[name='longerBreakRequiredCycles']").val();

            t.refresh(options);

            localStorage.setItem('workTime', options.workTime);
            localStorage.setItem('breakTime', options.breakTime);
            localStorage.setItem('longerBreakTime', options.extendedBreakTime);
            localStorage.setItem('longerBreakRequiredCycles', options.extendedBreakCycles);

            // flash screen to indicate that changes have been saved.
            var initial = $("body").css("background-color");
            $("#options").hide(200);
            $("body").css("background-color", colors.flashColor);
            setTimeout(function () {
                $("body").css("background-color", initial);
            }, 500);
        });

        $("#defaultify").click(function () {
            $("input[name='workTime']").val(defaults.workTime / 1000 / 60);
            $("input[name='breakTime']").val(defaults.breakTime / 1000 / 60);
            $("input[name='longerBreakTime']").val(defaults.extendedBreakTime / 1000 / 60);
            $("input[name='longerBreakRequiredCycles']").val(defaults.extendedBreakCycles);
        });
    });
})(jQuery);