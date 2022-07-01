$(function () {
    var $blin = $(".light p"),//所有彩灯
        $prize = $(".play li").not("#btn"),//含谢谢参与的所有奖品
        $change = $("#change"),//显示剩余机会
        $btn = $("#btn"),//开始抽奖按钮
        length = $prize.length,//奖品总数
        data = {count: 5},//次数
        bool = true,//判断是否可点击,true为可点击
        mark = 0,//标记当前位置，区间为0-7
        timer;//定时器

    init();
    //默认动画效果
    function init() {
        timer = setInterval(function () {
            //不能调用animate函数，不然标记会有问题
            $blin.toggleClass("blin");//彩灯动画
            //九宫格动画
            length++;
            length %= 8;
            $prize.eq(length - 1).removeClass("select");
            $prize.eq(length).addClass("select");

            //位置标记的改变
            mark++;
            mark %= 8;
        }, 1000);
    }

    //点击抽奖
    $btn.click(function () {
        if (bool) {//若未按下
            bool = false;
            if (data.count > 0) {//若还有次数
                data.count--;
                $change.html(data.count);
                clickFn();
            } else {
                alert("您剩余抽奖次数为0，不能抽奖~");
            }
        }
    });

    //点击旋转
    function clickFn() {
        clearInterval(timer);//点击抽奖时清除定时器
        var random = [1, 2, 3, 4, 5, 6, 7, 8];//抽奖概率
        //data为随机出来的结果，根据概率后的结果
        random = random[Math.floor(Math.random() * random.length)];//1-8的随机数
        mark += random;
        mark %= 8;
        //控制概率，永远抽不中谢谢参与
        if (mark === 3) {//抽中第一个谢谢参与则向前一位
            random++;
            mark++;
        }
        if (mark === 6) {//抽中第二个谢谢参与则向后一位
            random--;
            mark--;
        }
        //默认先转4圈
        random += 32;//圈数 * 奖品总数
        //调用旋转动画
        for (var i = 1; i <= random; i++) {
            setTimeout(animate(), 2 * i * i);//第二个值越大，慢速旋转时间越长
        }
        //停止旋转动画
        setTimeout(function () {
            console.log("中了" + mark);
            setTimeout(function () {
                bool = true;
                win();
            }, 1000);
        }, 2 * random * random);
    }

    //动画效果
    function animate() {
        return function () {
            $blin.toggleClass("blin");//彩灯动画
            //九宫格动画
            length++;
            length %= 8;
            $prize.eq(length - 1).removeClass("select");
            $prize.eq(length).addClass("select");
        }
    }

    //中奖信息提示
    $("#close,.win,.btn").click(function () {
        clearInterval(timer);//关闭弹出时清除定时器
        init();
    });

    //奖品展示
    var show = new Swiper(".swiper-container", {
        direction: "horizontal",//水平方向滑动。 vertical为垂直方向滑动
        loop: false,//是否循环
        slidesPerView: "auto"//自动根据slides的宽度来设定数量
    });
});





