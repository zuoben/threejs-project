/*
* 插件名: html5 css3 js 拖拽旋转放大插件封装
* @author Zion0707
* @date 2017-09-03
* @email 346445684@qq.com
* @version 1.0.5 
* @home https://github.com/Zion0707
* 调用方式 $(el).diyGo();
* 依赖于jq 或 Zepto
*/
; (function ($) {
    $.fn.diyGo = function (opt) {
        // 可以进行修改的参数
        var def = {
            minSize: 0.5,//元素最小放大值
            maxSize: 1.5,//元素最大放大值
            closeEl: '.icon-close', //关闭按钮
            flipOverEl: '.icon-qiehuan', //翻转按钮
            enlargeEl: '.icon-fangda', //放大按钮
            closeCallback: function (val) { }, //关闭回调
            flipOverCallback: function (val) { }, //翻转回调
            enlargeCallback: function (val) { }, //放大缩小旋转回调
        }
        opt = $.extend(def, opt);
        this.each(function () {
            var $this = $(this);
            var closeEl = $this.find(opt.closeEl)
            var flipOverEl = $this.find(opt.flipOverEl)
            var enlargeEl = $this.find(opt.enlargeEl)
            //元素点击的时候触发可以操作状态
            $this.on('click', function (ev) {
                ev.stopPropagation();
                $(this).addClass('diy-active').siblings('.diy-obj').removeClass('diy-active')
            })
            //关闭按钮
            closeEl.on('click', function () {
                $this.hide()
                opt.closeCallback($this)
            })
            //翻转按钮
            flipOverEl.on('click', function () {
                $this.toggleClass('flip-over')
                opt.flipOverCallback($this)
            })
            //放大缩小旋转
            enlargeEl.on('click', function () {
                opt.enlargeCallback($this)
            })
            var degNum = 0; //旋转角度
            var scaleNum = 1; //缩放大小
            var x = 0; //移动的x 轴
            var y = 0; //移动的y 轴

            //放大旋转的起始值(是元素的一半)
            var zrEndX = $this.width() / 2;
            var zrEndY = $this.width() / 2;

            var zoomRotation = function (obj) {
                var ozoomRotation = obj;
                //开始
                var zoomRotationStart = function (event) {
                    //阻止冒泡行为
                    event.stopPropagation();
                    //起始值 减去 位置值 等于 当前值
                    this.startX = event.touches[0].pageX - zrEndX;
                    this.startY = event.touches[0].pageY - zrEndY;
                    console.log('起始值', this.startX, this.startY)
                }
                //移动
                var zoomRotationMove = function (event) {
                    //阻止冒泡及默认行为
                    event.stopPropagation();
                    event.preventDefault();
                    //当前位置进行移动
                    this.offsetX = event.targetTouches[0].pageX - this.startX;
                    this.offsetY = event.targetTouches[0].pageY - this.startY;

                    //根据x,y 确定旋转角度
                    degNum = (this.offsetY - this.offsetX);
                    scaleNum = (this.offsetX + this.offsetY) / 90;
                    //放大缩小尺寸大小范围
                    if (scaleNum > opt.maxSize) {
                        scaleNum = opt.maxSize;
                    } else if (scaleNum < opt.minSize) {
                        scaleNum = opt.minSize;
                    }
                    if (event.targetTouches.length == 1) {
                        $this[0].style['-webkit-transform'] = 'translate(' + x + 'px,' + y + 'px)  rotate(' + degNum + 'deg) scale(' + scaleNum + ')';

                        //中间数 等于 最大值减去最小值 /2 
                        var centerNum = (opt.maxSize - opt.minSize + 0.3) / opt.maxSize / scaleNum + (scaleNum / 10);
                        //让操作按钮不管元素放大缩小都保持差不多大小
                        closeEl.css({ '-webkit-transform': 'scale(' + centerNum + ')' });
                        flipOverEl.css({ '-webkit-transform': 'scale(' + centerNum + ')' });
                        enlargeEl.css({ '-webkit-transform': 'scale(' + centerNum + ')' });
                    }
                }
                //离开的时候
                var zoomRotationEnd = function (event) {
                    zrEndX = this.offsetX || this.startX;
                    zrEndY = this.offsetY || this.startY;
                    console.log('结束', zrEndX, zrEndY)
                }
                //监听事件
                ozoomRotation.addEventListener('touchstart', zoomRotationStart);
                ozoomRotation.addEventListener('touchmove', zoomRotationMove);
                ozoomRotation.addEventListener('touchend', zoomRotationEnd);
            }
            zoomRotation(enlargeEl[0])




            //元素拖拽
            var drag = function (obj) {
                var oDrag = obj;
                //开始
                var dragStart = function (event) {
                    //阻止冒泡行为
                    event.stopPropagation();
                    //把当前获取的位置进行处理
                    var nowLocation = window.getComputedStyle(oDrag, null)['-webkit-transform'].replace(/[a-z()]/g, '');
                    var nowLocationArr = nowLocation.split(',');

                    //起始值 减去 位置值 等于 当前值
                    this.startX = event.touches[0].pageX - nowLocationArr[4];
                    this.startY = event.touches[0].pageY - nowLocationArr[5];
                }
                //移动
                var dragMove = function (event) {
                    //阻止冒泡及默认行为
                    event.stopPropagation();
                    event.preventDefault();
                    if (!$this.hasClass('diy-active')) return; //没有操作状态是不可以进行操作的

                    if (event.targetTouches.length == 1) {
                        //移动的 x 和 y 值
                        x = this.offsetX = event.targetTouches[0].pageX - this.startX;
                        y = this.offsetY = event.targetTouches[0].pageY - this.startY;

                        this.style['-webkit-transform'] = 'translate(' + this.offsetX + 'px,' + this.offsetY + 'px)  rotate(' + degNum + 'deg) scale(' + scaleNum + ')';
                    }
                }
                //监听事件
                oDrag.addEventListener('touchstart', dragStart);
                oDrag.addEventListener('touchmove', dragMove);
            }
            drag($this[0])

        });
        return this;
    }
})(jQuery);