$(function () {
    var WIDTH = document.documentElement.clientWidth,//屏幕宽度
        $balloon = $(".balloon"),//所有气球
        $arrow = $(".arrow"),//箭头
        $top = $(".top"),//上方套环
        $bottom = $(".bottom"),//下方套环
        arr = [//存入套环和气球的相关数值
            [$top.offset().left, $top.offset().top, $top.width(), $top.height()],
            [$bottom.offset().left, $bottom.offset().top, $bottom.width(), $bottom.height()],
            [$balloon[0].offsetTop, $balloon[1].offsetTop, $balloon[2].offsetTop, $balloon[3].offsetTop]
        ],
        bool = true,//点击开关，ture为可点击
        rem = 75, timer;

    $(".top,.bottom").on("touchstart",function (e) {
        e = e || window.event;
        e.preventDefault();
        typeof e.touches !== 'undefined' && (e = e.touches[0]);
        return false;
    });

    //松开
    $(".top,.bottom").on('touchend', function (e) {
        e = e || window.event;
        e.preventDefault();
        typeof e.touches !== 'undefined' && (e = e.changedTouches[0]);//离开触点
        var x = e.pageX, y = e.pageY;
        if (y > $top.offset().top) return;//必须要向上滑出一段距离

        //common
        if (!bool) return;
        if (data.count <= 0) {
            alert("没有次数了");
            return;
        }
        bool = false;
        data.count--;
        $("#change").html(data.count);
        //common end

        //移除动画
        $balloon.removeClass("shake-l");
        $balloon.removeClass("shake-r");
        $arrow.hide();

        (x <= WIDTH * 0.25) && ringMove(20, 315, 0);//第1个
        (x > WIDTH * 0.25 && x <= WIDTH * 0.5) && ringMove(210, 390, 1);//第2个
        (x > WIDTH * 0.5 && x <= WIDTH * 0.75) && ringMove(412, 315, 2);//第3个
        (x > WIDTH * 0.75) && ringMove(590, 320, 3);//第4个

        function ringMove(l, t, i) {//left、top、气球下标
            $top.animate({//套环的移动变化
                left: l / rem + "rem",
                top: t / rem + "rem",
                zIndex: 0,
                width: 135 / rem + "rem",
                height: 30 / rem + "rem"
            }, 1000);
            $bottom.animate({//套环的移动变化
                left: l / rem + "rem",
                top: (t + 28) / rem + "rem",
                width: 135 / rem + "rem",
                height: 30 / rem + "rem"
            }, 1000, function () {
                $top.addClass("shakeing");
                $bottom.addClass("shakeing");
                $top.animate({top: (t + rem) / rem + "rem"}, 800);

                $bottom.animate({top: (28 + t + rem) / rem + "rem"}, 800, function () {
                    $balloon.eq(i).animate({
                        opacity: 0,
                        top: "-" + rem
                    }, 1000, function () {
                        $balloon.eq(i).css("top", (arr[2][i] + rem) + "px");//气球回到原位置下方
                        clickData(false);//ajax回调
                        //红包弹出
                        win();
                        $top.css({//套环归位
                            left: arr[0][0],
                            top: arr[0][1],
                            width: arr[0][2],
                            height: arr[0][3]
                        });
                        $bottom.css({//套环归位
                            left: arr[1][0],
                            top: arr[1][1],
                            width: arr[1][2],
                            height: arr[1][3]
                        });
                        $top.removeClass("shakeing");
                        $bottom.removeClass("shakeing");
                        $arrow.show();
                        $balloon.addClass("shake-l");
                        for (var j = 0, length = $balloon.length; j < length; j++) {
                            if (j > 3) {
                                $balloon.eq(j).removeClass("shake-l");
                                $balloon.eq(j).addClass("shake-r");
                            }
                        }

                        //close
                        clearTimeout(timer);
                        $("#close,.win,.btn").click(function () {
                            $balloon.eq(i).animate({//气球归位
                                opacity: 1,
                                top: arr[2][i]
                            }, 1000);
                            timer = setTimeout(function () {
                                bool = true;
                            }, 1000);
                        });
                    });
                });
            });
        }

    });

});










