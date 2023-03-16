$(function() {
    var time = 10;
    var str = 3;
    var progressBarInterval;
    var passwordValue = '';
    var check_passwoord = false;
    window.addEventListener('message', function(e) {
        var item = e.data;
        if (item.action == "start") {
            time = Number(item.time);
            str = Number(item.string);
            $('.hackBox').fadeIn(500);
            $('#textInfo').html("Prepare...");
            progressBarStart('start', 2);
        }
    });

    window.addEventListener('keypress', function (event) {
		if (!check_passwoord) return;
		if (event.key === 'Enter') {
			if (checkResult($("#hackMemoryValue").val())) {
				gameWin();
			} else {
				gameOver();
			}
		}
	});

    const gameWin = () => {
        check_passwoord = false;
        $('.hackInfo').css("display", "block");
        $('#textInfo').html("Success!!!");
        $(".hackFunction").css("display", "none");
        $(".hackText").css("display", "none");
        progressBarStart('end', 5);
        setTimeout(function(){
            $.post('https://kd_boostingmemory/success');
        }, 3000);
    };
    

    const gameOver = () => {
        check_passwoord = false;
        $('.hackInfo').css("display", "block");
        $('#textInfo').html("Fail!!!");
        $(".hackFunction").css("display", "none");
        $(".hackText").css("display", "none");
        progressBarStart('end', 5);
        setTimeout(function(){
            $.post('https://kd_boostingmemory/fail');
        }, 3000);
    };
    
    function progressBarStart(type, times) {
        var maxwidth = 1000;
        var width = maxwidth;
        const process = () => {
            if (width > 0) {
                if (type == 'start' || type == 'end') 
                    {width = width - 3;}
                else 
                    {width--;}
                    var per =  (width * 100.0) / maxwidth + '%'
                    $(".progressBar").css("width", per);
            } else {
                if (type == 'start') {
                    $(".hackFunction").css("display", "block");
                    $(".hackText").css("display", "block");
                    $("#hackMemoryValue").css("display", 'none');
                    $(".hackInfo").css("display", 'none');
                    $("#hackValue").css("display", 'block');
                    $('#textInfo1').html("Remember the string of characters");
                    passwordValue = randomString(str);
                    $('#hackValue').html(`${passwordValue.toUpperCase()}`);
                    progressBarStart('game', time);
                    return;
                }
   
                if (type == 'game') {
                    $("#hackValue").css("display", 'none');
                    $("#hackMemoryValue").css("display", 'block');
                    $("#hackMemoryValue").val("")
                    $(".hackText").css("display", "block");
                    $('#textInfo1').html("Enter a string of characters");
                    check_passwoord = true;
                    progressBarStart('result', time);
                    return;
                }
    
                if (type == 'result') {
                    $('#hackValue').css("display", "none");
                    $('.hackInfo').css("display", "block");
                    $('.hackText').css("display", "block");
                    gameOver();
                }
            
                if (type == 'end') {
                    $('.hackBox').fadeOut(500);
                } 
            }
        };
        clearInterval(progressBarInterval);
        progressBarInterval = setInterval(process, times);
    }

    function randomString(length) {
        var length = length
        var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
        var result = '';
        for (var i = length; i > 0; --i) 
        {
            result += chars[Math.floor(Math.random() * chars.length)];
        };
        return result;
    }

    function checkResult(result) {
        return result.toUpperCase() == passwordValue.toUpperCase();
    }
    

});