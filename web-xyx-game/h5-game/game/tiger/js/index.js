$(function () {
    var prizeArr = ["豪华礼包", "索尼相机", "平板电脑"],//奖品内容
        $li = $(".info li"),//中奖信息滚动的盒子
        $sNum = $(".start-num"),//手机头号，三位数
        $eNum = $(".end-num"),//手机尾号，四位数
        $info = $(".prize"),//中奖提示信息
        $go = $("#go"),
        $hand = $("#hand"),
        $roll = $(".roll ul"),
        topRoll = parseInt($roll.eq(0).css("top")),//滚动盒子的top
        prizeHigh = parseInt($(".prize1").eq(0).height()),//奖品高度
        topArr = [topRoll, topRoll - prizeHigh, topRoll - prizeHigh * 2],//三个奖品的位置
        data = {count: 5},//次数
        bool = true,//true为可点击
        clickTimer, timer1, timer2, timer3;

    //开始按钮
    $go.click(function () {
        if (!bool) return;
        if (data.count <= 0) {
            alert("没有次数了");
            return;
        }
        bool = false;
        data.count--;
        $("#change").html(data.count);

        clearTimeout(clickTimer);
        $hand.removeClass("shak");//移除手摇晃动画
        $hand.animate({
            left: 50 + "%",
            top: 40 + "%"
        }, 500, function () {
            $hand.css("transform", "rotate(-20deg)");//按下按钮
            clickTimer = setTimeout(function () {
                $hand.css("transform", "rotate(0deg)");//抬起
                $hand.animate({
                    left: 60 + "%",
                    top: 50 + "%"
                }, 500, function () {
                    $hand.addClass("shak");
                });
            }, 300);
            clickFn();
        });
    });

    //点击滚动
    function clickFn() {
        clearInterval(timer1);//点击抽奖时清除定时器
        clearInterval(timer2);
        clearInterval(timer3);
        //var random = [1, 2, 3];//抽奖概率
        //random = random[Math.floor(Math.random() * random.length)];//1-3的随机数
        var random = 1;
        //默认先转8圈
        random += 40;//圈数 * 奖品总数
        //调用滚动动画
        for (var i = 1; i <= random; i++) {
            timer1 = setTimeout(animate(random - 40, i, 0), i * i);//第二个值越大，慢速旋转时间越长
            timer2 = setTimeout(animate(random - 40, i, 1), 2 * i * i);
            timer3 = setTimeout(animate(random - 40, i, 2), 3 * i * i);
        }
        //停止旋转动画
        setTimeout(function () {
            setTimeout(function () {
                win();
                roll(10, 10, prizeArr[random - 41]);//随机数 - 41是因为它是从1起始的，又加了40
            }, 1000);
        }, 3 * random * random);
    }

    //滚动动画
    function animate(r, i, index) {//随机数、循环数，滚动盒子下标
        return function () {
            topRoll = parseFloat($roll.eq(index).css("top")) - prizeHigh / 2;//减去每个奖品高的一半
            topRoll <= topArr[2] && (topRoll = topArr[0]);//滚动到最后一个则返回到第一个
            $roll.eq(index).css("top", topRoll + "px");
            r + 40 === i && $roll.eq(index).css("top", topArr[r - 1] + "px");//循环到最后一次，设定top
        }
    }

    //中奖信息滚动。前两个参数为手机号前三位和后四位手机尾号，text为中的奖品
    function roll(sNum, eNum, text) {
        //最新中奖信息
        $sNum.eq(1).html(sNum);
        $eNum.eq(1).html(eNum);
        $info.eq(1).html(text);
        $li.css("top", "-" + 36 / 75 + "rem");//滚动
        //滚动之后的处理
        setTimeout(function () {
            $li.css({
                "top": "0",
                "transition": "all 0s ease-in-out"
            });
            //更新中奖信息
            $sNum.eq(0).html($sNum.eq(1).html());
            $eNum.eq(0).html($eNum.eq(1).html());
            $info.eq(0).html($info.eq(1).html());
        }, 500);
        $li.css("transition", "all 0.5s ease-in-out");
    }

    //中奖信息提示

    $("#close,.win,.btn").click(function () {
        bool = true;
    });

    //奖品展示
    var show = new Swiper(".swiper-container", {
        direction: "horizontal",//水平方向滑动。 vertical为垂直方向滑动
        loop: false,//是否循环
        slidesPerView: "auto"//自动根据slides的宽度来设定数量
    });
});










