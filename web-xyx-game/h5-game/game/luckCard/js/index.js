$(function () {
    var $cards = $(".box li"),//所有卡牌
        $maskCard = $("#mask-card"),//翻牌遮罩
        length = $cards.length,
        index = length,//轮流滚动的卡牌下标
        data = {count: 5},//次数
        rem = 75,
        initArr = [[34 / rem, 0], [273 / rem, 0], [512 / rem, 0], [34 / rem, 268 / rem], [273 / rem, 268 / rem], [512 / rem, 268 / rem]],//卡牌位置数组
        clickTime = 0,
        bool = false,//首次点击时不能在卡牌归位期间
        timer;//轮流提示定时器

    init();
    function init() {
        //卡牌归位动画
        for (var i = 0; i < length; i++) {
            (function (i) {
                var seat = setTimeout(function () {
                    $cards.eq(i).css({
                        left: initArr[i][0] + "rem",
                        top: initArr[i][1] + "rem"
                    });
                    clearTimeout(seat);
                }, 300 * i);
            })(i);
        }

        //卡牌轮流选中动画
        setTimeout(function () {
            timer = setInterval(function () {
                bool = true;//卡牌归位，可以点击
                $cards.eq(index - 1).removeClass("active");
                index %= 6;
                $cards.eq(index).addClass("active");
                index++;
            }, 1000);
        }, 1000);
    }

    //点击卡牌翻转
    $(".box").on("click", "li", function () {
        if (new Date() - clickTime > 2000 && bool) {//两次点击的间隔不能小于2秒
            if (data.count > 0) {
                /*console.log(222);
                data.count--;
                $("#change").html(data.count);*/
                $maskCard.show();
                clearInterval(timer);//清除轮流选中动画
                $cards.removeClass("active");//清除轮流滚动类名
                $(this).addClass("open-card");//添加翻牌动画

                //动画监听
                $(this).on("animationend", function () {
                    $(this).removeClass("open-card");//移除翻牌动画
                    $cards.css({//所有卡牌放到右下角
                        left: 512 / rem + "rem",
                        top: 268 / rem + "rem"
                    });
                    $maskCard.hide();
                    win();
                    $(this).off("animationend");//解绑动画监听
                });
            } else {
                alert("没有次数了~");
            }
        }
    });

    //中奖信息提示
    $("#close,.win,.btn").click(function () {
        clickTime = new Date();//时间更新
        index = length;//卡牌选中重新从第一张开始
        init();
    });

    //奖品展示
    var show = new Swiper(".swiper-container", {
        direction: "horizontal",//水平方向滑动。 vertical为垂直方向滑动
        loop: false,//是否循环
        slidesPerView: "auto"//自动根据slides的宽度来设定数量
    });
});










