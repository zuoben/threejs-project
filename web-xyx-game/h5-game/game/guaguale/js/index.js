$(function () {
    var $canvas = $("#canvas"),//canvas
        clientWidth = document.documentElement.clientWidth,
        canvasWidth = Math.floor(clientWidth * 562 / 750),//canvas宽 = 屏幕宽 * 设计稿里canvas宽 / 750
        canvasHeight = Math.floor(clientWidth * 308 / 750),//canvas高 = 屏幕宽 * 设计稿里canvas高 / 750
        ctx = $canvas[0].getContext("2d"),//获取canvas的2d绘制对象
        $canvasMask = $("#canvas-mask"),//canvas遮罩层
        $btn = $("#btn"),//刮奖按钮
        $change = $("#change"),//剩余次数
        data = {count: 5},//次数
        empty = false,
        bool = false;//判断是否按下去，true为按下，false未按下

    //canvas初始化
    init();

    function init() {
        $canvasMask.show();
        $change.html(data.count);//显示剩余次数
        //设置canvas宽高
        $canvas.attr('width', canvasWidth);
        $canvas.attr('height', canvasHeight);

        //canvas绘图
        ctx.beginPath();
        ctx.fillStyle = '#999';//刮刮乐图层的填充色
        ctx.lineCap = "round";//绘制的线结束时为圆形
        ctx.lineJoin = "round";//当两条线交汇时创建圆形边角
        ctx.lineWidth = 20;//单次刮开面积
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.closePath();

        ctx.globalCompositeOperation = 'destination-out';//新图像和原图像重合部分变透明
        //下面3行代码是为了修复部分手机浏览器不支持destination-out
        $canvas.css("display", "none");
        $canvas.outerHeight();
        $canvas.css("display", "inherit");
    }

    //点击开始刮奖按钮
    $btn.click(function () {
        if (data.count > 0) {
            data.count--;//设定中奖的图片
            $canvas.css("background-image", "url('../common/image/prize/prize2.png')");
            $canvasMask.hide();
        } else {
            alert("没有次数了");
        }
    });

    /*canvas事件*/
    //pc端
    $canvas.on({
        //鼠标按下
        mousedown: function (e) {
            e = e || window.event;
            e.preventDefault();
            bool = true;
            var x = e.pageX - $(this).offset().left,//鼠标距离该页面left的值 - 元素左侧距离文档的left
                y = e.pageY - $(this).offset().top;
            ctx.moveTo(x, y);

            //鼠标移动
            $canvas.on('mousemove', function (e) {
                if (bool) {
                    var x = e.pageX - $(this).offset().left;
                    var y = e.pageY - $(this).offset().top;
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    clear();
                }
            });
        },
        //鼠标按键抬起
        mouseup: function () {
            bool = false;
        }
    });

    //移动端
    $canvas.on("touchstart", function (e) {
        e = e || window.event;
        e.preventDefault();
        if (typeof e.touches !== 'undefined') {
            e = e.touches[0];//获取触点
        }
        var x = e.pageX - $(this).offset().left,
            y = e.pageY - $(this).offset().top;
        ctx.moveTo(x, y);
        //touchmove事件
        $canvas.on('touchmove', eventMove);
    });

    //移动事件
    function eventMove(e) {
        e = e || window.event;
        e.preventDefault();
        if (typeof e.touches !== 'undefined') {
            e = e.touches[0];
        }
        var x = e.pageX - $(this).offset().left,
            y = e.pageY - $(this).offset().top;
        ctx.lineTo(x, y);
        ctx.stroke();
        clear();
    }

    //清除画布
    function clear() {
        if (empty) return;
        var data = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data,//得到canvas的全部数据
            half = 0;

        //length = canvasWidth * canvasHeight * 4，一个像素块是一个对象rgba四个值，a范围为0~255
        for (var i = 3, length = data.length; i < length; i += 4) {//因为有rgba四个值，下标0开始，所以初始i=3
            data[i] === 0 && half++;//存在imageData对象时half加1  PS:该像素区域透明即为不存在该对象
        }
        //当刮开的区域大于等于20%时，则可以开始处理结果
        if (half >= canvasWidth * canvasHeight * 0.2) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);//清空画布
            empty = true;
            win();//调用中奖信息
        }
    }

    //中奖信息提示
    $("#close,.win,.btn").click(function () {
        empty = false;
        init();
    });

    //奖品展示
    var show = new Swiper(".swiper-container", {
        direction: "horizontal",//水平方向滑动。 vertical为垂直方向滑动
        loop: false,//是否循环
        slidesPerView: "auto"//自动根据slides的宽度来设定数量
    });
});

