$(function () {
    $("#submit").click(function () {
        localStorage.setItem('workTime', $("input[name='workTime']").val() * 60);
        localStorage.setItem('breakTime', $("input[name='breakTime']").val() * 60);
        localStorage.setItem('longerBreakTime', $("input[name='longerBreakTime']").val() * 60);
        localStorage.setItem('longerBreakRequiredCycles', $("input[name='longerBreakRequiredCycles']").val());
        workTime = $("input[name='workTime']").val() * 60;
        breakTime = $("input[name='breakTime']").val() * 60;
        longerBreakTime = $("input[name='longerBreakTime']").val() * 60;
        longerBreakRequiredCycles = $("input[name='longerBreakRequiredCycles']").val();
        var initial = $("body").css("background-color");
        $("#options").hide(200);
        $("body").css("background-color", "#536dfe");
        setTimeout(function () {
            $("body").css("background-color", initial);
        }, 500);
        timer.userdefun.grabTime();
        $("#clock").html(formatAsMinutes(workTime));
    });
});