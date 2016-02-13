$(function () {
    $("#submit").click(function () {
        localStorage.setItem('workTime', $("input[name='workTime']").val() * 60);
        localStorage.setItem('breakTime', $("input[name='breakTime']").val() * 60);
        localStorage.setItem('longerBreakTime', $("input[name='longerBreakTime']").val() * 60);
        localStorage.setItem('longerBreakRequiredCycles', $("input[name='longerBreakRequiredCycles']").val());
        $("body").css("background-color", "#2fe7ad");
        setInterval(function () {
            $("body").css("background-color", "#ffffff");
        }, 1000);
    });
});