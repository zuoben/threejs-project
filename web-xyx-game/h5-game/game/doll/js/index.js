$(function () {
    var WIDTH = Math.floor(document.documentElement.clientWidth * 0.45),//屏幕宽度*0.45来设置li的宽度
        $behindList = $(".behind ul li"),//福袋父级
        $frontList = $(".front ul li"),
        $behindBag = $(".moveing-left"),//后方运动盒子
        $frontBag = $(".moveing-right"),//前方运动盒子
        $topBag = $(".behind img"),//后方每个福袋
        $bottomBag = $(".front img"),//前方每个福袋
        $btn = $("#btn"),//游戏按钮
        $hook = $("#hook"),//钩子
        data = {count: 5},//次数
        bool = true,//点击开关，ture为可点击
        rem = 75,
        left, right, index,//福袋运动值，福袋下标
        times, timer;

    $(".behind li,.front li").css("width", WIDTH + "px");//设置li的宽度
    init();

    function init() {
        window.requestAnimationFrame = window.requestAnimationFrame || function (fn) {
            return setTimeout(fn, 1000 / 60);//1000 / 60意思是一秒钟60帧
        };
        //cancelAnimationFrame是清除requestAnimationFrame
        window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

        (function move() {
            //后方福袋的运动
            left = parseFloat($behindBag.css("margin-left"));//获取margin-left并去掉单位
            left = left - 1.5;//改变margin-left值
            $behindBag.css("margin-left", left + "px");
            left <= -WIDTH && $behindBag.css("margin-left", "0");//如果margin-left值到达屏幕宽度则归零

            //前方福袋的运动
            right = parseFloat($frontBag.css("margin-right"));//获取margin-right并去掉单位
            right = right - 1.5;//改变margin-right值
            $frontBag.css("margin-right", right + "px");
            right <= -WIDTH && $frontBag.css("margin-right", "0");//如果margin-right值到达屏幕宽度则归零

            timer = requestAnimationFrame(move);
        })();
    }

    //开始游戏
    $btn.click(function () {
        if (!bool) return;
        if (data.count <= 0) {
            alert("没有次数了");
            return;
        }
        bool = false;
        data.count--;
        $("#change").html(data.count);

        var random = Math.floor(Math.random() * 490 + 130);//130 - 620之间随机，因为这两个值是左右边界
        $(".left,.right").addClass("up");//张开钩子

        $hook.animate({left: random / rem + "rem"}, 1000);//左右值
        clearTimeout(times);
        //上下值
        if (random > 380) {//上面
            $hook.animate({top: -100 / rem + "rem"}, 1000);
            times = setTimeout(function () {
                reback1();
            }, 2000);
        } else {//下面
            $hook.animate({top: 50 / rem + "rem"}, 1000);
            times = setTimeout(function () {
                reback2();
            }, 2000);
        }
    });

    //判断钩子和福袋的距离
    function reback1() {
        for (var i = 0; i < $behindList.length; i++) {
            if ($hook.find("img").length) break;//如果钩子上已经有福袋跳出循环
            if ($hook.position().left - 130 <= $behindList.eq(i).position().left && $behindList.eq(i).position().left <= $hook.position().left - 50) {
                //获取福袋
                !$hook.find("img").length && $hook.append($topBag.eq(i));//如果未抓取到福袋才抓取
                $topBag.eq(i).css({//重设福袋大小
                    width: 91 / rem + "rem",
                    height: 102 / rem + "rem"
                });

                //钩子返回，弹出红包
                index = i;
                $hook.animate({top: -220 / rem + "rem"}, 1000, function () {
                    win();
                    $behindList.eq(index).append($topBag.eq(index));//把福袋放回原位
                    index = undefined;
                });
            } else {
                setTimeout(function () {
                    return reback1();
                });
            }
        }
    }

    function reback2() {
        for (var i = 0; i < $frontList.length; i++) {
            if ($hook.find("img").length) break;//如果钩子上已经有福袋跳出循环
            var l = $frontList.eq(i).position().left - 200;
            if ($hook.position().left - 130 <= l && l <= $hook.position().left) {
                //获取福袋
                !$hook.find("img").length && $hook.append($bottomBag.eq(i));//如果未抓取到福袋才抓取
                $bottomBag.eq(i).css({//重设福袋大小
                    width: 139 / rem + "rem",
                    height: 156 / rem + "rem"
                });

                //钩子返回，弹出红包
                index = i;
                $hook.animate({top: -220 / rem + "rem"}, 1000, function () {
                    win();
                    $frontList.eq(index).append($bottomBag.eq(index));
                    index = undefined;
                });
            } else {
                setTimeout(function () {
                    return reback2();
                });
            }
        }
    }

    //中奖信息提示
    $("#close,.win,.btn").click(function () {
        bool = true;
        $(".left,.right").removeClass("up");
        cancelAnimationFrame(timer);
        init();
    });

    //奖品展示
    var show = new Swiper(".swiper-container", {
        direction: "horizontal",//水平方向滑动。 vertical为垂直方向滑动
        loop: false,//是否循环
        slidesPerView: "auto"//自动根据slides的宽度来设定数量
    });
});










